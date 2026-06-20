import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * KB Searcher — given a ticket (and optionally a retrieved candidate set), returns the
 * top KB articles that answer it as TYPED hits with a confidence score. Never invents
 * an article: when no candidate is grounded, it returns `noMatch` + a suggested topic
 * the article should cover, rather than a hallucinated URL.
 *
 * Pass `retrieve` to ground answers in YOUR corpus — only candidates it returns can be
 * cited (the agent is told to cite none if the set is empty). Without it the model may
 * only cite articles named verbatim in the ticket.
 */

export interface KbHit {
  title: string
  url: string
  /** One-sentence quote of the matching section. */
  quote: string
  /** 1 (weak) – 5 (exact). */
  confidence: number
}

export interface KbSearchResult {
  hits: KbHit[]
  /** True when nothing grounded matched. */
  noMatch: boolean
  /** When noMatch: the topic a new article should cover. */
  suggestedTopic?: string
}

export interface KbCandidate {
  title: string
  url: string
  snippet: string
}

export interface KbSearcherConfig {
  adapter: AdapterFactory
  /** Optional retriever — only the candidates it returns may be cited. */
  retrieve?: (ticket: string) => Promise<KbCandidate[]> | KbCandidate[]
  /** Max hits to return (default 3). */
  topK?: number
  /** Drop hits below this confidence (1-5, default 2). */
  minConfidence?: number
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Hit = z.object({
  title: z.string(),
  url: z.string(),
  quote: z.string(),
  confidence: z.number().int().min(1).max(5),
})
const Output = z.object({
  hits: z.array(Hit),
  noMatch: z.boolean(),
  suggestedTopic: z.string().optional(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'kb-searcher',
  description: 'Returns the top knowledge-base articles answering a ticket, with confidence.',
  systemPrompt: `You match a support ticket to knowledge-base articles. Return the best articles as hits,
each with: title, url, a one-sentence quote of the matching section, and a confidence 1-5.

NEVER invent an article. If CANDIDATES are provided, cite ONLY from them (and cite NONE if the set
is empty). If nothing genuinely matches, set noMatch=true, return an empty hits array, and put the
topic a new article should cover in suggestedTopic.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_results exactly once with { hits, noMatch, suggestedTopic? }. Stop.`,
  tools: ['submit_results'],
}

export function createKbSearcherAgent(config: KbSearcherConfig) {
  const topK = config.topK ?? 3
  const minConf = config.minConfidence ?? 2
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_results', description: 'Submit the KB hits. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(ticket: string): Promise<KbSearchResult> {
    if (!ticket?.trim()) throw new Error('kb searcher requires a non-empty ticket')

    let candidateBlock = ''
    let allowedUrls: Set<string> | null = null
    if (config.retrieve) {
      emit('retrieve', 'start')
      const candidates = (await config.retrieve(ticket)) ?? []
      allowedUrls = new Set(candidates.map((c) => c.url))
      emit('retrieve', 'ok', `${candidates.length} candidate(s)`)
      candidateBlock = `\n\nCANDIDATES (cite only these; cite none if empty):\n${fenceUntrustedContent(
        candidates.map((c) => `- ${c.title} <${c.url}>: ${c.snippet}`).join('\n') || '(none)',
      )}`
    }

    emit('search', 'start')
    let out: z.infer<typeof Output>
    try {
      out = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `TICKET:\n${fenceUntrustedContent(ticket)}${candidateBlock}`,
        parse: (a) => Output.parse(a),
        skill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      emit('search', 'error')
      return { hits: [], noMatch: true, suggestedTopic: 'search unavailable — retry' }
    }

    // Ground: drop low-confidence hits and (if retrieving) any URL not in the candidate set.
    const hits = out.hits
      .filter((h) => h.confidence >= minConf)
      .filter((h) => (allowedUrls ? allowedUrls.has(h.url) : true))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, topK)
    const noMatch = hits.length === 0
    emit('search', 'ok', noMatch ? 'no match' : `${hits.length} hit(s)`)
    return {
      hits,
      noMatch,
      suggestedTopic: noMatch ? (out.suggestedTopic ?? `coverage for: ${ticket.slice(0, 80)}`) : undefined,
    }
  }

  return {
    name: 'support-kb-searcher',
    run,
    asHandle() {
      return { name: 'support-kb-searcher', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
