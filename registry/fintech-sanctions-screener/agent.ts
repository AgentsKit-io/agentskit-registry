import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fuzzyMatchList } from '@agentskit/core/fuzzy-match'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Sanctions Screener — screens a customer/counterparty against a sanctions list and
 * decides clear vs escalate. The compliance guarantee ("never auto-clear a strong or
 * exact match") is enforced in CODE, not a prompt:
 *
 *   1. DETERMINISTIC match — `fuzzyMatchList` (Jaro-Winkler) scores the name against
 *      the loaded list. No LLM, no tokens, fully auditable.
 *   2. HARD RULE — any hit at/above `strongThreshold` is escalated unconditionally;
 *      the model is never asked and cannot clear it.
 *   3. The model ONLY adjudicates WEAK hits (screen ≤ score < strong) — given the
 *      candidate's DOB/country it may downgrade a fuzzy near-miss to a false positive.
 *      A model that hallucinates can therefore only ever make screening *stricter*.
 *
 * Drop in your own list (OFAC/UN/EU SDN exports) via `sanctionsList`.
 *
 * ```ts
 * import { anthropic } from '@agentskit/adapters'
 * const agent = createSanctionsScreenerAgent({
 *   adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
 *   sanctionsList: ofacSdnNames, // string[] or { name, list?, date? }[]
 * })
 * const result = await agent.run({ name: 'Vladimir Putin', country: 'RU' })
 * if (result.requiresHumanSignoff) routeToCompliance(result)
 * ```
 */

export interface SanctionsEntry {
  name: string
  /** Source list, e.g. 'OFAC-SDN'. */
  list?: string
  /** List/designation date. */
  date?: string
}

export interface Candidate {
  /** Legal name to screen (required). */
  name: string
  country?: string
  /** Date of birth — helps the adjudicator downgrade weak hits. */
  dob?: string
}

export interface SanctionsHit {
  matched: string
  list?: string
  score: number
  decision: 'true-match' | 'false-positive'
  rationale: string
  /** False only when escalated. A strong/exact hit is NEVER auto-cleared. */
  autoCleared: boolean
}

export interface ScreeningResult {
  candidate: Candidate
  status: 'clear' | 'escalate'
  hits: SanctionsHit[]
  /** Strong/exact or adjudicated-true hits require compliance sign-off. */
  requiresHumanSignoff: boolean
}

export interface SanctionsScreenerConfig {
  adapter: AdapterFactory
  /** The sanctions/PEP list to screen against (names or structured entries). */
  sanctionsList: Array<string | SanctionsEntry>
  /** At/above this score a hit is escalated unconditionally (never adjudicated). Default 0.92. */
  strongThreshold?: number
  /** At/above this score a hit surfaces for adjudication. Default 0.85. */
  screenThreshold?: number
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Verdict = z.object({
  decision: z.enum(['true-match', 'false-positive']),
  rationale: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const adjudicator = {
  name: 'sanctions-adjudicator',
  description: 'Adjudicates a single weak fuzzy sanctions hit against the candidate context.',
  systemPrompt: `You adjudicate ONE possible sanctions match. You are given a candidate record and a single
fuzzy-matched list name with its similarity score. Decide whether they are the SAME real-world
party, using country and date of birth as corroborating signals.

${UNTRUSTED_CONTENT_DIRECTIVE}

Be conservative: only return "false-positive" when the evidence clearly shows a DIFFERENT person
(e.g. mismatched DOB/country, a common-name coincidence). When unsure, return "true-match" — a
human reviews escalations; a wrongly-cleared sanctioned party is a regulatory breach.

Call submit_verdict exactly once with { decision, rationale }. Output nothing else.`,
  tools: ['submit_verdict'],
}

const nameOf = (e: string | SanctionsEntry): string => (typeof e === 'string' ? e : e.name)

export function createSanctionsScreenerAgent(config: SanctionsScreenerConfig) {
  const strong = config.strongThreshold ?? 0.92
  const screen = config.screenThreshold ?? 0.85
  const names = config.sanctionsList.map(nameOf)
  const entryByName = new Map(config.sanctionsList.map((e) => [nameOf(e), typeof e === 'string' ? undefined : e]))

  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_verdict',
      description: 'Submit the adjudication verdict. Call exactly once.',
      schema: Verdict,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  async function adjudicate(c: Candidate, matched: string, score: number): Promise<z.infer<typeof Verdict>> {
    const task = `CANDIDATE:\n${fenceUntrustedContent(JSON.stringify(c))}\n\nPOSSIBLE MATCH (score ${score.toFixed(3)}):\n${fenceUntrustedContent(matched)}`
    try {
      return await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task,
        parse: (a) => Verdict.parse(a),
        skill: adjudicator,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      // A failed/malformed adjudication must FAIL SAFE → treat as a true match (escalate).
      return { decision: 'true-match', rationale: 'adjudication unavailable — failed safe to escalation' }
    }
  }

  async function run(candidate: Candidate): Promise<ScreeningResult> {
    if (!candidate?.name?.trim()) throw new Error('sanctions screen requires a candidate legal name')

    emit('screen', 'start', candidate.name)
    const matches = fuzzyMatchList(candidate.name, names, { threshold: screen, topK: 25 })
    emit('screen', matches.length ? 'ok' : 'skip', `${matches.length} candidate hit(s)`)

    const hits: SanctionsHit[] = []
    for (const m of matches) {
      const entry = entryByName.get(m.candidate)
      if (m.score >= strong) {
        // HARD RULE: strong/exact never reaches the model + is never auto-cleared.
        hits.push({
          matched: m.candidate,
          list: entry?.list,
          score: m.score,
          decision: 'true-match',
          rationale: `score ${m.score.toFixed(3)} ≥ strong ${strong} — auto-escalated`,
          autoCleared: false,
        })
        continue
      }
      // Weak hit → the model may downgrade it (and ONLY downgrade).
      const v = await adjudicate(candidate, m.candidate, m.score)
      hits.push({
        matched: m.candidate,
        list: entry?.list,
        score: m.score,
        decision: v.decision,
        rationale: entry?.date ? `${v.rationale} (listed ${entry.date})` : v.rationale,
        autoCleared: v.decision === 'false-positive',
      })
    }

    const escalated = hits.filter((h) => !h.autoCleared)
    const status = escalated.length ? 'escalate' : 'clear'
    emit('verdict', 'ok', `${status} (${escalated.length}/${hits.length} unresolved)`)
    return { candidate, status, hits, requiresHumanSignoff: status === 'escalate' }
  }

  return {
    name: 'fintech-sanctions-screener',
    run,
    /** AgentHandle: accepts a JSON candidate, returns a JSON ScreeningResult. */
    asHandle() {
      return {
        name: 'fintech-sanctions-screener',
        run: async (task: string) => JSON.stringify(await run(JSON.parse(task) as Candidate)),
      }
    },
  }
}
