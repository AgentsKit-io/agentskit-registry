import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * SAR Drafter — SAR draft typed
 * Pain: SAR writing manual
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface Section { heading: string; body: string; citations: string[] }
export interface AgentOutput { title: string; sections: Section[]; gaps: string[]; openQuestions: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface FintechSarDrafterConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const SectionSchema = z.object({ heading: z.string(), body: z.string(), citations: z.array(z.string()).default([]) })
const Output = z.object({
  title: z.string(),
  sections: z.array(SectionSchema).min(1),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7



const skill = {
  name: 'fintech-sar-drafter',
  description: "SAR Drafter — typed output agent (draft spec).",
  systemPrompt: `You are SAR Drafter. SAR writing manual. Expected output: SAR draft typed.

Draft document sections. Cite sources inline in citations[]. Missing facts go to gaps, not invented prose.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_sar_drafter exactly once with the structured result. Stop.`,
  tools: ['submit_sar_drafter'],
}

export function createFintechSarDrafterAgent(config: FintechSarDrafterConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_sar_drafter',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('fintech-sar-drafter requires non-empty input')
    emit('run', 'start')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `INPUT:\n${fenceUntrustedContent(input)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    emit('run', 'ok')
    return { ...result, requiresReview: true }
  }

  return {
    name: 'fintech-sar-drafter',
    run,
    asHandle() {
      return { name: 'fintech-sar-drafter', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
