import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { createRuntime } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'
import { classifier, leakAuditor, sanitizer } from './skills'

/**
 * Knowledge Promoter — turns curated private notes into PUBLIC documentation PRs,
 * safely. Pipeline: classify → sanitize → leak-gate → publish (one draft PR). The
 * sanitizer (writer) and leak auditor are separate agents in separate runtimes, so
 * the writer never grades its own homework. The leak gate is DETERMINISTIC: a regex
 * denylist plus the adversarial auditor, both run by orchestration code — never a
 * step the model can decide to skip. It never merges; a human reviews the draft PR.
 *
 * Reusable for any "private notes → public docs" flow: inject your site map, house
 * style, denylist, and a `publish` function.
 *
 * ```ts
 * import { anthropic } from '@agentskit/adapters'
 * const agent = createKnowledgePromoterAgent({
 *   adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
 *   siteMapUrl: 'https://docs.example.com/llms.txt',
 *   houseStyle: '# Title → ## TL;DR → ## For agents → ### See also',
 *   denylist: [/\bACME-\d+\b/, /\binternal-[a-z]+\b/],
 *   publish: async (drafts) => openDraftPrSomehow(drafts),
 * })
 * const report = await agent.run(candidates)
 * ```
 */

export interface Candidate {
  /** Stable id for ledger/dedup (caller-owned). */
  id: string
  title: string
  /** Raw lesson text — may contain internal context; the pipeline strips it. */
  lesson: string
}

export interface PreparedDoc {
  candidate: Candidate
  category: string | null
  shape: 'new' | 'enrich'
  targetDoc: string | null
  /** Assembled markdown with frontmatter, ready to write. */
  markdown: string
  title: string
  droppedForGenerality: string[]
}

export interface PromoteOutcome {
  candidate: Candidate
  status: 'promoted' | 'rejected' | 'blocked'
  /** For rejected/blocked: why. For promoted: the doc that will be opened. */
  detail: string
}

export type PromoteStage = 'classify' | 'sanitize' | 'leak-gate' | 'publish'

/**
 * Progress is emitted through the standard observer channel as `AgentEvent`s of
 * `{ type: 'progress', label, status, detail?, durationMs? }`. Pass any Observer
 * in `observers` (e.g. `createProgressObserver()` from `@agentskit/ink`) to render
 * it live — no bespoke callback; one channel for runtime + domain events.
 */

export interface KnowledgePromoterConfig {
  /** Any AgentsKit adapter (anthropic, openai, gemini, …). */
  adapter: AdapterFactory
  /** URL of the target docs' machine-readable site map (e.g. /llms.txt), for dedup. */
  siteMapUrl: string
  /** House-style spec injected verbatim into the sanitizer (frontmatter + section order). */
  houseStyle: string
  /** Regex denylist — the deterministic first leak layer. Hits = hard block. */
  denylist: RegExp[]
  /** Opens ONE draft PR with all cleared docs and returns its number/URL. Never merges. */
  publish: (docs: PreparedDoc[]) => Promise<{ pr: number | string; url?: string }>
  /** Optional: conversation memory, observers, HITL confirm, step cap. */
  memory?: ChatMemory
  observers?: Observer[]
  /** Per-tool-call confirmation gate (HITL / RBAC) — passed to the runtime. */
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  /** Independent leak-audit votes; the gate blocks on a MAJORITY of "block". Default 3. */
  auditVotes?: number
  maxSteps?: number
}

const Classification = z.object({
  isGeneralizable: z.boolean(),
  category: z.string().nullable(),
  shape: z.enum(['new', 'enrich']),
  targetDoc: z.string().nullable(),
  alreadyCovered: z.boolean(),
  reason: z.string(),
})
const Sanitized = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  body: z.string(),
  droppedForGenerality: z.array(z.string()),
})
const LeakVerdict = z.object({
  verdict: z.enum(['clean', 'block']),
  identifiers: z.array(z.string()),
  explanation: z.string(),
})

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

export function createKnowledgePromoterAgent(config: KnowledgePromoterConfig) {
  const maxSteps = config.maxSteps ?? 4

  // submit_* tools: the agent's only job each stage is to call one of these once.
  // execute() just acknowledges — the structured payload is read back from toolCalls.
  const submit = (name: string, schema: z.ZodTypeAny): ToolDefinition =>
    defineZodTool({
      name,
      description: `Submit the ${name.replace('submit_', '').replace('_', ' ')} result. Call exactly once.`,
      schema,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  // One focused runtime per structured stage → reads the validated payload back.
  async function runStructured<T extends z.ZodTypeAny>(opts: {
    skill: typeof classifier
    task: string
    tool: ToolDefinition
    schema: T
  }): Promise<z.infer<T>> {
    const runtime = createRuntime({
      adapter: config.adapter,
      tools: [opts.tool],
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps,
    })
    const result = await runtime.run(opts.task, { skill: opts.skill })
    const call = result.toolCalls.find((c) => c.name === opts.tool.name)
    if (!call) throw new Error(`${opts.skill.name} did not submit a result`)
    return opts.schema.parse(call.args)
  }

  async function fetchSiteMap(): Promise<string> {
    const res = await fetch(config.siteMapUrl)
    if (!res.ok) throw new Error(`site map fetch failed: ${res.status}`)
    return res.text()
  }

  const auditVotes = Math.max(1, config.auditVotes ?? 3)

  async function leakGate(text: string): Promise<{ ok: boolean; hits: string[]; note?: string }> {
    // Layer 1 — regex denylist (deterministic, no tokens). Any hit hard-blocks.
    const hits = [...new Set(config.denylist.flatMap((re) => text.match(new RegExp(re, 'g')) ?? []))]
    if (hits.length) return { ok: false, hits }
    // Layer 2 — N independent adversarial auditors (separate runtimes, in parallel).
    // Block on a MAJORITY of "block" verdicts; each auditor defaults to "block" when unsure.
    const verdicts = await Promise.all(
      Array.from({ length: auditVotes }, () =>
        runStructured({ skill: leakAuditor, task: text, tool: submit('submit_leak_verdict', LeakVerdict), schema: LeakVerdict }),
      ),
    )
    const blocked = verdicts.filter((v) => v.verdict !== 'clean')
    if (blocked.length * 2 >= auditVotes) {
      return { ok: false, hits: [...new Set(blocked.flatMap((v) => v.identifiers))], note: blocked[0]?.explanation }
    }
    return { ok: true, hits: [] }
  }

  // Emit a domain-progress AgentEvent through the standard observer channel.
  const emit = (label: PromoteStage, status: 'start' | 'ok' | 'skip' | 'error', detail?: string, durationMs?: number) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail, durationMs })
  }

  // Times a stage, emitting start → ok progress around it.
  async function stage<T>(name: PromoteStage, fn: () => Promise<T>, label: (r: T) => string): Promise<T> {
    emit(name, 'start')
    const t0 = Date.now()
    const result = await fn()
    emit(name, 'ok', label(result), Date.now() - t0)
    return result
  }

  async function run(candidates: Candidate[]): Promise<{ outcomes: PromoteOutcome[]; pr?: { pr: number | string; url?: string } }> {
    if (candidates.length === 0) return { outcomes: [] }
    const siteMap = await fetchSiteMap()
    const outcomes: PromoteOutcome[] = []
    const docs: PreparedDoc[] = []

    for (const c of candidates) {
      // 1 — classify (always re-decides; dedup against the live site map).
      const cls = await stage('classify',
        () => runStructured({ skill: classifier, task: `SITE MAP:\n${siteMap}\n\nCANDIDATE LESSON (title: ${c.title}):\n${c.lesson}`, tool: submit('submit_classification', Classification), schema: Classification }),
        (r) => (r.isGeneralizable && !r.alreadyCovered ? `${c.title} → ${r.category} · ${r.shape}` : 'skip'))
      if (!cls.isGeneralizable || cls.alreadyCovered) {
        const detail = cls.alreadyCovered ? `duplicate: ${cls.reason}` : `not generalizable: ${cls.reason}`
        emit('classify', 'skip', `${c.title}: ${detail}`)
        outcomes.push({ candidate: c, status: 'rejected', detail })
        continue
      }

      // 2 — sanitize into the target house style.
      const sani = await stage('sanitize',
        () => runStructured({ skill: sanitizer, task: `CATEGORY: ${cls.category}\nSHAPE: ${cls.shape}${cls.targetDoc ? ` (${cls.targetDoc})` : ''}\n\nHOUSE STYLE:\n${config.houseStyle}\n\nLESSON:\n${c.lesson}`, tool: submit('submit_sanitized', Sanitized), schema: Sanitized }),
        (r) => `"${r.title}"`)

      // 3 — leak gate (regex + N adversarial auditors). BOTH layers must pass.
      const markdown = `---\ntype: ${sani.type}\ntitle: '${sani.title.replace(/'/g, "''")}'\ndescription: '${sani.description.replace(/'/g, "''")}'\n---\n\n${sani.body}\n`
      emit('leak-gate', 'start')
      const t0 = Date.now()
      const gate = await leakGate(`${sani.title}\n${sani.description}\n${sani.body}`)
      if (!gate.ok) {
        emit('leak-gate', 'error', `blocked: ${gate.hits.join(', ')}`, Date.now() - t0)
        outcomes.push({ candidate: c, status: 'blocked', detail: `leak-gate: ${gate.hits.join(', ')}${gate.note ? ` — ${gate.note}` : ''}` })
        continue
      }
      emit('leak-gate', 'ok', `clean (${auditVotes} votes)`, Date.now() - t0)

      docs.push({ candidate: c, category: cls.category, shape: cls.shape, targetDoc: cls.targetDoc, markdown, title: sani.title, droppedForGenerality: sani.droppedForGenerality })
      outcomes.push({ candidate: c, status: 'promoted', detail: `${cls.shape} ${cls.category}/${sani.title}` })
    }

    // 4 — one batched draft PR (human gate). Never merges.
    if (docs.length === 0) return { outcomes }
    emit('publish', 'start', `${docs.length} doc(s)`)
    const t0 = Date.now()
    const pr = await config.publish(docs)
    emit('publish', 'ok', `PR ${pr.pr}`, Date.now() - t0)
    return { outcomes, pr }
  }

  return {
    /** Stable name for orchestration (supervisor / swarm / A2A). */
    name: 'knowledge-promoter',
    run,
    /** AgentHandle: accepts a JSON array of candidates, returns a text summary. */
    asHandle() {
      return {
        name: 'knowledge-promoter',
        run: async (task: string) => {
          const candidates = JSON.parse(task) as Candidate[]
          const { outcomes, pr } = await run(candidates)
          return JSON.stringify({ outcomes, pr }, null, 2)
        },
      }
    },
  }
}

// fetchUrl is re-exported for consumers who prefer the AgentsKit tool over global fetch.
export { fetchUrl } from '@agentskit/tools'
