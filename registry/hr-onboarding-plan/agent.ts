import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Onboarding Plan — Plan typed
 * Pain: 30/60/90 ad-hoc
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface Step { order: number; action: string; owner?: string; notes?: string }
export interface AgentOutput { title: string; steps: Step[]; risks: string[]; gaps: string[]; openQuestions: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface HrOnboardingPlanConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Step = z.object({ order: z.number().int(), action: z.string(), owner: z.string().optional(), notes: z.string().optional() })
const Output = z.object({
  title: z.string(),
  steps: z.array(Step).min(1),
  risks: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7



const skill = {
  name: 'hr-onboarding-plan',
  description: "Onboarding Plan — typed output agent (draft spec).",
  systemPrompt: `You are Onboarding Plan. 30/60/90 ad-hoc. Expected output: Plan typed.

Produce an ordered plan with risks and gaps for missing info.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_onboarding_plan exactly once with the structured result. Stop.`,
  tools: ['submit_onboarding_plan'],
}

export function createHrOnboardingPlanAgent(config: HrOnboardingPlanConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_onboarding_plan',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('hr-onboarding-plan requires non-empty input')
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
    name: 'hr-onboarding-plan',
    run,
    asHandle() {
      return { name: 'hr-onboarding-plan', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
