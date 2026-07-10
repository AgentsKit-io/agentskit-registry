import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Messaging Hierarchy — Hierarchy typed
 * Pain: Inconsistent messaging
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface AgentOutput { summary: string; insights: string[]; gaps: string[]; openQuestions: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface MarketingMessagingHierarchyConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  insights: z.array(z.string()),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7



const skill = {
  name: 'marketing-messaging-hierarchy',
  description: "Messaging Hierarchy — typed output agent (draft spec).",
  systemPrompt: `You are Messaging Hierarchy. Inconsistent messaging. Expected output: Hierarchy typed.

Summarize with insights grounded in input.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_messaging_hierarchy exactly once with the structured result. Stop.`,
  tools: ['submit_messaging_hierarchy'],
}

export function createMarketingMessagingHierarchyAgent(config: MarketingMessagingHierarchyConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_messaging_hierarchy',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('marketing-messaging-hierarchy requires non-empty input')
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
    name: 'marketing-messaging-hierarchy',
    run,
    asHandle() {
      return { name: 'marketing-messaging-hierarchy', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
