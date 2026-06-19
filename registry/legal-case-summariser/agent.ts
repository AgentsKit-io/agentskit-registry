import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Case Summariser — produces a TYPED, court-ready matter summary from reviewed documents
 * + reviewer notes. Every factual claim cites the underlying document ID; inconsistent
 * notes are FLAGGED as conflicts rather than resolved by picking a side. Always a draft.
 *
 * ```ts
 * const { summary, conflicts } = await createCaseSummariserAgent({ adapter }).run(docsAndNotes)
 * ```
 */

export interface CitedFact {
  fact: string
  /** Underlying document ID(s). */
  citation: string
}

export interface Conflict {
  issue: string
  /** The competing accounts found in the notes. */
  positions: string[]
}

export interface MatterSummary {
  partiesAndCounsel: string
  proceduralPosture: string
  keyFacts: CitedFact[]
  openIssues: string[]
}

export interface CaseSummaryResult {
  summary: MatterSummary
  /** Inconsistencies in the source notes — flagged, never silently resolved. */
  conflicts: Conflict[]
  /** Always true — a draft for the supervising attorney. */
  requiresAttorneyReview: boolean
}

export interface CaseSummariserConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  partiesAndCounsel: z.string(),
  proceduralPosture: z.string(),
  keyFacts: z.array(z.object({ fact: z.string(), citation: z.string() })),
  openIssues: z.array(z.string()),
  conflicts: z.array(z.object({ issue: z.string(), positions: z.array(z.string()) })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'case-summariser',
  description: 'Produces a typed, cited matter summary from reviewed documents (flags conflicts).',
  systemPrompt: `You produce a court-ready matter summary from reviewed documents + the reviewer's notes.
Structure: parties and counsel; procedural posture; key facts (each citing the underlying document
ID); open issues for the supervising attorney.

Neutral, professional tone. Do NOT editorialise. EVERY factual claim must cite a source document. If
the underlying notes are INCONSISTENT, record the competing accounts in conflicts rather than picking
a side.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_summary exactly once with { partiesAndCounsel, proceduralPosture, keyFacts, openIssues, conflicts }. Stop.`,
  tools: ['submit_summary'],
}

export function createCaseSummariserAgent(config: CaseSummariserConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_summary', description: 'Submit the matter summary. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<CaseSummaryResult> {
    if (!input?.trim()) throw new Error('case summariser requires reviewed documents + notes')
    emit('summarise', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `REVIEWED DOCUMENTS + REVIEWER NOTES:\n${fenceUntrustedContent(input)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const { conflicts, ...summary } = out
    emit('summarise', 'ok', `${conflicts.length} conflict(s)`)
    return { summary, conflicts, requiresAttorneyReview: true }
  }

  return {
    name: 'legal-case-summariser',
    run,
    asHandle() {
      return { name: 'legal-case-summariser', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
