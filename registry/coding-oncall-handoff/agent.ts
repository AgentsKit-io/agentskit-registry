import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** On-call Handoff — v1 validated. Pain: Shift changes lose context */

export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface CodingOncallHandoffConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  score: z.number().min(0).max(100),
  band: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.array(z.string()),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'coding-oncall-handoff',
  description: "On-call Handoff — typed output agent (draft spec).",
  systemPrompt: `You are On-call Handoff. Shift changes lose context. Output: Handoff typed: incidents, risks, next steps.
Score 0-100 with explicit factors from input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_oncall_handoff exactly once. Stop.`,
  tools: ['submit_oncall_handoff'],
}

export function createCodingOncallHandoffAgent(config: CodingOncallHandoffConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_oncall_handoff', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('coding-oncall-handoff requires non-empty input')
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
    return { ...result, requiresReview: true }
  }
  return {
    name: 'coding-oncall-handoff',
    run,
    asHandle() { return { name: 'coding-oncall-handoff', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
