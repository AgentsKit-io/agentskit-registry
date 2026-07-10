import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Onboarding Plan — v1 validated. Pain: 30/60/90 ad-hoc */

export interface Step { order: number; action: string; owner?: string; notes?: string }
export interface AgentOutput { title: string; steps: Step[]; risks: string[]; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface HrOnboardingPlanConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  title: z.string(),
  steps: z.array(z.object({ order: z.number().int(), action: z.string(), owner: z.string().optional(), notes: z.string().optional() })).min(1),
  risks: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'hr-onboarding-plan',
  description: "Onboarding Plan — typed output agent (draft spec).",
  systemPrompt: `You are Onboarding Plan. 30/60/90 ad-hoc. Output: Plan typed.
Ordered plan with risks and gaps.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_onboarding_plan exactly once. Stop.`,
  tools: ['submit_onboarding_plan'],
}

export function createHrOnboardingPlanAgent(config: HrOnboardingPlanConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_onboarding_plan', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('hr-onboarding-plan requires non-empty input')
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
    name: 'hr-onboarding-plan',
    run,
    asHandle() { return { name: 'hr-onboarding-plan', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
