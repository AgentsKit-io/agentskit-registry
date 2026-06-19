import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fuzzyMatchList } from '@agentskit/core/fuzzy-match'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * KYC Screener — onboarding identity screen against sanctions / PEP / adverse-media
 * lists. Like the sanctions screener, the compliance guarantee is enforced in CODE:
 * a DETERMINISTIC `fuzzyMatchList` gate, a HARD RULE that strong/exact hits escalate
 * unconditionally (the model can never clear them), and the model only DOWNGRADES
 * weak near-misses (so a hallucination can only make screening stricter). Required
 * KYC fields (name, DOB, country) are validated up front — it refuses, never guesses.
 *
 * ```ts
 * const agent = createKycScreenerAgent({
 *   adapter,
 *   lists: [{ name: 'Vladimir Putin', list: 'PEP' }, { name: 'Jane Doe', list: 'ADVERSE-MEDIA' }],
 * })
 * const r = await agent.run({ name: 'Jane Doe', dob: '1980-02-02', country: 'US' })
 * if (r.requiresHumanSignoff) routeToCompliance(r)
 * ```
 */

export type ListSource = string // e.g. 'OFAC-SDN' | 'PEP' | 'ADVERSE-MEDIA'

export interface ListEntry {
  name: string
  list?: ListSource
  date?: string
}

export interface KycCandidate {
  name: string
  dob: string
  country: string
}

export interface KycHit {
  matched: string
  list?: ListSource
  score: number
  decision: 'true-match' | 'false-positive'
  rationale: string
  autoCleared: boolean
}

export type RiskTier = 'clear' | 'escalate'

export interface KycResult {
  candidate: KycCandidate
  riskTier: RiskTier
  hits: KycHit[]
  requiresHumanSignoff: boolean
  /** Missing required fields, when the screen is refused. */
  missing?: string[]
}

export interface KycScreenerConfig {
  adapter: AdapterFactory
  /** Combined screening list — tag each entry with its source via `list`. */
  lists: Array<string | ListEntry>
  strongThreshold?: number
  screenThreshold?: number
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Verdict = z.object({ decision: z.enum(['true-match', 'false-positive']), rationale: z.string() })
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const adjudicator = {
  name: 'kyc-adjudicator',
  description: 'Adjudicates a single weak fuzzy KYC hit against the candidate identity.',
  systemPrompt: `You adjudicate ONE possible KYC list match. Given a candidate identity (name, DOB, country)
and a single fuzzy-matched list name + score, decide whether they are the SAME real-world party.

${UNTRUSTED_CONTENT_DIRECTIVE}

Be conservative: return "false-positive" ONLY when the evidence clearly shows a different person
(mismatched DOB/country, common-name coincidence). When unsure, return "true-match" — a human
reviews escalations; wrongly onboarding a sanctioned/PEP party is a regulatory breach.

Call submit_verdict exactly once with { decision, rationale }. Output nothing else.`,
  tools: ['submit_verdict'],
}

const nameOf = (e: string | ListEntry): string => (typeof e === 'string' ? e : e.name)
const REQUIRED: (keyof KycCandidate)[] = ['name', 'dob', 'country']

export function createKycScreenerAgent(config: KycScreenerConfig) {
  const strong = config.strongThreshold ?? 0.92
  const screen = config.screenThreshold ?? 0.85
  const names = config.lists.map(nameOf)
  const entryByName = new Map(config.lists.map((e) => [nameOf(e), typeof e === 'string' ? undefined : e]))

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

  async function adjudicate(c: KycCandidate, matched: string, score: number): Promise<z.infer<typeof Verdict>> {
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
      return { decision: 'true-match', rationale: 'adjudication unavailable — failed safe to escalation' }
    }
  }

  async function run(candidate: KycCandidate): Promise<KycResult> {
    const missing = REQUIRED.filter((k) => !candidate?.[k] || !String(candidate[k]).trim())
    if (missing.length) {
      emit('validate', 'error', `missing: ${missing.join(', ')}`)
      return { candidate, riskTier: 'escalate', hits: [], requiresHumanSignoff: true, missing }
    }

    emit('screen', 'start', candidate.name)
    const matches = fuzzyMatchList(candidate.name, names, { threshold: screen, topK: 25 })
    emit('screen', matches.length ? 'ok' : 'skip', `${matches.length} candidate hit(s)`)

    const hits: KycHit[] = []
    for (const m of matches) {
      const entry = entryByName.get(m.candidate)
      if (m.score >= strong) {
        hits.push({ matched: m.candidate, list: entry?.list, score: m.score, decision: 'true-match', rationale: `score ${m.score.toFixed(3)} ≥ strong ${strong} — auto-escalated`, autoCleared: false })
        continue
      }
      const v = await adjudicate(candidate, m.candidate, m.score)
      hits.push({ matched: m.candidate, list: entry?.list, score: m.score, decision: v.decision, rationale: entry?.date ? `${v.rationale} (listed ${entry.date})` : v.rationale, autoCleared: v.decision === 'false-positive' })
    }

    const escalated = hits.filter((h) => !h.autoCleared)
    const riskTier: RiskTier = escalated.length ? 'escalate' : 'clear'
    emit('verdict', 'ok', `${riskTier} (${escalated.length}/${hits.length} unresolved)`)
    return { candidate, riskTier, hits, requiresHumanSignoff: riskTier === 'escalate' }
  }

  return {
    name: 'fintech-kyc-screener',
    run,
    asHandle() {
      return {
        name: 'fintech-kyc-screener',
        run: async (task: string) => JSON.stringify(await run(JSON.parse(task) as KycCandidate)),
      }
    },
  }
}
