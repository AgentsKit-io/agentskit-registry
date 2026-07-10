import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Third-party Risk — v1 validated. Pain: Vendor risk */

export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface SecurityThirdPartyRiskConfig {
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
  name: 'security-third-party-risk',
  description: "Third-party Risk — typed output agent (draft spec).",
  systemPrompt: `You are Third-party Risk. Vendor risk. Output: Assessment typed.
Score 0-100 with explicit factors from input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_party_risk exactly once. Stop.`,
  tools: ['submit_party_risk'],
}

export function createSecurityThirdPartyRiskAgent(config: SecurityThirdPartyRiskConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_party_risk', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('security-third-party-risk requires non-empty input')
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
    name: 'security-third-party-risk',
    run,
    asHandle() { return { name: 'security-third-party-risk', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
