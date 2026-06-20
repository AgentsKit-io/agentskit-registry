import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Patient Summary — drafts a typed one-page pre-visit summary from chart excerpts.
 * Structured fields (not a blob), never invents values ("not in chart" for gaps), and
 * always a draft for the clinician to confirm.
 *
 * ```ts
 * const { summary } = await createPatientSummaryAgent({ adapter }).run(chartExcerpts)
 * ```
 */

export interface PatientSummary {
  reasonForVisit: string
  /** Active problems, most relevant first (max 5). */
  activeProblems: string[]
  medications: string[]
  allergies: string[]
  vitalsTrend: string
  followUps: string[]
  openQuestions: string[]
}

export interface PatientSummaryResult {
  summary: PatientSummary
  /** Always true — a draft for the clinician to confirm. */
  requiresClinicianSignoff: boolean
}

export interface PatientSummaryConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Summary = z.object({
  reasonForVisit: z.string(),
  activeProblems: z.array(z.string()).max(5),
  medications: z.array(z.string()),
  allergies: z.array(z.string()),
  vitalsTrend: z.string(),
  followUps: z.array(z.string()),
  openQuestions: z.array(z.string()),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'patient-summary',
  description: 'Drafts a typed one-page pre-visit patient summary from chart excerpts.',
  systemPrompt: `You draft a one-page pre-visit summary from the supplied chart excerpts. Fields: a
one-sentence reason for visit; active problems (max 5, most relevant first); current medications;
allergies; vitals trend; outstanding follow-ups; open questions.

NEVER invent values. If the chart lacks a field, use "not in chart" (or an empty array) rather
than guessing. This is a DRAFT for the clinician to confirm.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_summary exactly once with the structured fields. Stop.`,
  tools: ['submit_summary'],
}

export function createPatientSummaryAgent(config: PatientSummaryConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_summary', description: 'Submit the patient summary. Call exactly once.', schema: Summary, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(chart: string): Promise<PatientSummaryResult> {
    if (!chart?.trim()) throw new Error('patient summary requires non-empty chart excerpts')
    emit('summarise', 'start')
    const summary = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CHART EXCERPTS:\n${fenceUntrustedContent(chart)}`,
      parse: (a) => Summary.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('summarise', 'ok', `${summary.activeProblems.length} problem(s)`)
    return { summary, requiresClinicianSignoff: true }
  }

  return {
    name: 'clinical-patient-summary',
    run,
    asHandle() {
      return { name: 'clinical-patient-summary', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
