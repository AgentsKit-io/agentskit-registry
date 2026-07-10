import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Feedback Clusterer — Clusters typed
 * Pain: Feedback scattered
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface ProductFeedbackClustererConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Cluster = z.object({ name: z.string(), theme: z.string(), items: z.array(z.string()) })
const Output = z.object({
  summary: z.string(),
  clusters: z.array(Cluster).min(1),
  unassigned: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7



const skill = {
  name: 'product-feedback-clusterer',
  description: "Feedback Clusterer — typed output agent (draft spec).",
  systemPrompt: `You are Feedback Clusterer. Feedback scattered. Expected output: Clusters typed.

Group items into named clusters with themes.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_feedback_clusterer exactly once with the structured result. Stop.`,
  tools: ['submit_feedback_clusterer'],
}

export function createProductFeedbackClustererAgent(config: ProductFeedbackClustererConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_feedback_clusterer',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('product-feedback-clusterer requires non-empty input')
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
    name: 'product-feedback-clusterer',
    run,
    asHandle() {
      return { name: 'product-feedback-clusterer', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
