import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Credit Memo — Memo typed
 * Pain: Credit decisions undocumented
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface Section { heading: string; body: string; citations: string[] }
export interface AgentOutput { title: string; sections: Section[]; gaps: string[]; openQuestions: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface FintechCreditMemoConfig {
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
  name: 'fintech-credit-memo',
  description: "Credit Memo — typed output agent (draft spec).",
  systemPrompt: `You are Credit Memo. Credit decisions undocumented. Expected output: Memo typed.

Draft document sections. Cite sources inline in citations[]. Missing facts go to gaps, not invented prose.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_credit_memo exactly once with the structured result. Stop.`,
  tools: ['submit_credit_memo'],
}

export function createFintechCreditMemoAgent(config: FintechCreditMemoConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_credit_memo',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('fintech-credit-memo requires non-empty input')
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
    name: 'fintech-credit-memo',
    run,
    asHandle() {
      return { name: 'fintech-credit-memo', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
