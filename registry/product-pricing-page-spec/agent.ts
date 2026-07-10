import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Pricing Page Spec — v1 validated. Pain: Pricing pages vague */

export interface Section { heading: string; body: string; citations: string[] }
export interface AgentOutput { title: string; sections: Section[]; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface ProductPricingPageSpecConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  title: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string(), citations: z.array(z.string()).default([]) })).min(1),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'product-pricing-page-spec',
  description: "Pricing Page Spec — typed output agent (draft spec).",
  systemPrompt: `You are Pricing Page Spec. Pricing pages vague. Output: Spec typed.
Draft sections with citations from input. Gaps for missing facts.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_page_spec exactly once. Stop.`,
  tools: ['submit_page_spec'],
}

export function createProductPricingPageSpecAgent(config: ProductPricingPageSpecConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_page_spec', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('product-pricing-page-spec requires non-empty input')
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
    name: 'product-pricing-page-spec',
    run,
    asHandle() { return { name: 'product-pricing-page-spec', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
