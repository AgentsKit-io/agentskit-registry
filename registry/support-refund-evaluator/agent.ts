import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Refund Evaluator — Decision + rationale typed
 * Pain: Refund decisions inconsistent
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface AgentOutput {
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  queue: string
  rationale: string
  gaps: string[]
  openQuestions: string[]
}

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface SupportRefundEvaluatorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  category: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  queue: z.string(),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, o: z.infer<typeof Output>): z.infer<typeof Output> {
  const critical = /\b(outage|down|breach|emergency|stroke|suicidal|data loss|security incident)\b/i
  if (critical.test(input) && o.severity !== 'critical') {
    return { ...o, severity: 'critical', queue: 'escalation', rationale: o.rationale + ' [safety-net: forced critical]' }
  }
  return o
}

const skill = {
  name: 'support-refund-evaluator',
  description: "Refund Evaluator — typed output agent (draft spec).",
  systemPrompt: `You are Refund Evaluator. Refund decisions inconsistent. Expected output: Decision + rationale typed.

Classify with category, severity (critical|high|medium|low), and suggested queue. List gaps for missing input.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_refund_evaluator exactly once with the structured result. Stop.`,
  tools: ['submit_refund_evaluator'],
}

export function createSupportRefundEvaluatorAgent(config: SupportRefundEvaluatorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_refund_evaluator',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('support-refund-evaluator requires non-empty input')
    emit('run', 'start')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `INPUT:\n${fenceUntrustedContent(input)}`,
      parse: (a) => applySafetyNet(input, Output.parse(a)),
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
    name: 'support-refund-evaluator',
    run,
    asHandle() {
      return { name: 'support-refund-evaluator', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
