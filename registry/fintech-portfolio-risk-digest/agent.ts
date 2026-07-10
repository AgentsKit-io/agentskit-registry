import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Portfolio Risk Digest — v1 validated. Pain: Risk reporting manual */

export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface FintechPortfolioRiskDigestConfig {
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
  name: 'fintech-portfolio-risk-digest',
  description: "Portfolio Risk Digest — typed output agent (draft spec).",
  systemPrompt: `You are Portfolio Risk Digest. Risk reporting manual. Output: Digest typed.
Score 0-100 with explicit factors from input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_risk_digest exactly once. Stop.`,
  tools: ['submit_risk_digest'],
}

export function createFintechPortfolioRiskDigestAgent(config: FintechPortfolioRiskDigestConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_risk_digest', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('fintech-portfolio-risk-digest requires non-empty input')
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
    name: 'fintech-portfolio-risk-digest',
    run,
    asHandle() { return { name: 'fintech-portfolio-risk-digest', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
