import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Case Analyst — extracts a TYPED structured analysis from a case file (parties, venue,
 * posture, claims, defenses, key dates, open discovery). Every datum cites its source
 * document + page; gaps are "not in record" (never inferred); statute-of-limitations /
 * filing-deadline risks are surfaced separately at the top. Always a draft.
 *
 * ```ts
 * const { analysis, deadlineRisks } = await createCaseAnalystAgent({ adapter }).run(caseFile)
 * ```
 */

const NOT_IN_RECORD = 'not in record'

export interface CitedFact {
  value: string
  /** Source document + page, or "not in record". */
  citation: string
}

export interface CaseAnalysis {
  parties: CitedFact[]
  jurisdictionVenue: CitedFact
  proceduralPosture: CitedFact
  claims: CitedFact[]
  defenses: CitedFact[]
  keyDates: CitedFact[]
  openDiscovery: CitedFact[]
}

export interface CaseAnalysisResult {
  analysis: CaseAnalysis
  /** SOL / filing-deadline risks, surfaced at the top for the attorney. */
  deadlineRisks: string[]
  /** Always true — a draft for the supervising attorney. */
  requiresAttorneyReview: boolean
}

export interface CaseAnalystConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Cited = z.object({ value: z.string(), citation: z.string() })
const Analysis = z.object({
  parties: z.array(Cited),
  jurisdictionVenue: Cited,
  proceduralPosture: Cited,
  claims: z.array(Cited),
  defenses: z.array(Cited),
  keyDates: z.array(Cited),
  openDiscovery: z.array(Cited),
  deadlineRisks: z.array(z.string()),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'case-analyst',
  description: 'Extracts a typed, cited case analysis from a case file (never infers).',
  systemPrompt: `You analyse a case file (pleadings, exhibits, correspondence). Produce: parties + counsel,
jurisdiction + venue, procedural posture, claims, defenses, key dates, open discovery requests.

CITE the source document + page for EVERY datum (in citation). NEVER editorialise. When the record is
silent on a field, set value to "${NOT_IN_RECORD}" and citation to "${NOT_IN_RECORD}" rather than
inferring. Surface every statute-of-limitations or filing-deadline risk in deadlineRisks.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_analysis exactly once with the structured fields + deadlineRisks. Stop.`,
  tools: ['submit_analysis'],
}

export function createCaseAnalystAgent(config: CaseAnalystConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_analysis', description: 'Submit the case analysis. Call exactly once.', schema: Analysis, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(caseFile: string): Promise<CaseAnalysisResult> {
    if (!caseFile?.trim()) throw new Error('case analyst requires a non-empty case file')
    emit('analyse', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CASE FILE:\n${fenceUntrustedContent(caseFile)}`,
      parse: (a) => Analysis.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const { deadlineRisks, ...analysis } = out
    emit('analyse', 'ok', `${deadlineRisks.length} deadline risk(s)`)
    return { analysis, deadlineRisks, requiresAttorneyReview: true }
  }

  return {
    name: 'legal-case-analyst',
    run,
    asHandle() {
      return { name: 'legal-case-analyst', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
