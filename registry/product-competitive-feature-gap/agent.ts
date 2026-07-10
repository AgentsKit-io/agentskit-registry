import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Competitive Feature Gap — v1 validated. Pain: Feature gaps unclear */

export interface Finding { id: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; message: string; source?: string; recommendation?: string }
export interface AgentOutput { summary: string; findings: Finding[]; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface ProductCompetitiveFeatureGapConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  findings: z.array(z.object({
    id: z.string(), severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    message: z.string(), source: z.string().optional(), recommendation: z.string().optional(),
  })),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'product-competitive-feature-gap',
  description: "Competitive Feature Gap — typed output agent (draft spec).",
  systemPrompt: `You are Competitive Feature Gap. Feature gaps unclear. Output: Gap analysis typed.
Actionable findings citing input sources. No invented issues.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_feature_gap exactly once. Stop.`,
  tools: ['submit_feature_gap'],
}

export function createProductCompetitiveFeatureGapAgent(config: ProductCompetitiveFeatureGapConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_feature_gap', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('product-competitive-feature-gap requires non-empty input')
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
    name: 'product-competitive-feature-gap',
    run,
    asHandle() { return { name: 'product-competitive-feature-gap', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
