import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * SOAP Generator — turns clinician dictation into a typed SOAP note (Subjective,
 * Objective, Assessment, Plan). Structured output (each section addressable, not one
 * blob), missing sections surfaced (never silently blank), and ALWAYS a draft for
 * clinician sign-off.
 *
 * ```ts
 * const { note, missingFields } = await createNoteSummariserAgent({ adapter }).run(dictation)
 * ```
 */

export interface SoapNote {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface NoteResult {
  note: SoapNote
  /** SOAP sections the dictation didn't cover — for the clinician to fill, not invent. */
  missingFields: string[]
  /** Always true — output is a draft, never a finalised record. */
  requiresClinicianSignoff: boolean
}

export interface NoteSummariserConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Soap = z.object({
  subjective: z.string(),
  objective: z.string(),
  assessment: z.string(),
  plan: z.string(),
  missingFields: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'note-summariser',
  description: 'Converts clinician dictation into a typed SOAP note (draft for sign-off).',
  systemPrompt: `You convert clinician dictation into a SOAP note: Subjective, Objective, Assessment, Plan.
Preserve clinical facts verbatim. Do NOT infer diagnoses the clinician did not state. Standardise
units (mg, mL, bpm, mmHg). If a section is not covered in the dictation, leave it empty and add
its name to missingFields — never invent content.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_note exactly once with { subjective, objective, assessment, plan, missingFields }. Stop.`,
  tools: ['submit_note'],
}

export function createNoteSummariserAgent(config: NoteSummariserConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_note', description: 'Submit the SOAP note. Call exactly once.', schema: Soap, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(dictation: string): Promise<NoteResult> {
    if (!dictation?.trim()) throw new Error('note summariser requires non-empty dictation')
    emit('summarise', 'start')
    const r = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CLINICIAN DICTATION:\n${fenceUntrustedContent(dictation)}`,
      parse: (a) => Soap.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('summarise', 'ok', `${r.missingFields.length} missing section(s)`)
    const { missingFields, ...note } = r
    return { note, missingFields, requiresClinicianSignoff: true }
  }

  return {
    name: 'clinical-note-summariser',
    run,
    asHandle() {
      return { name: 'clinical-note-summariser', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
