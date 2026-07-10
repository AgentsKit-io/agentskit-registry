import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Doc-bridge Handoff Author — DRAFT scaffold.
 * Pain: Agent handoffs between doc-bridge index and human adapters
 * Output: Handoff doc typed per agent-handoff-v1 schema
 * Promote to validated after agent.test.ts + eval.ts pass and curator review.
 */

export const EcosystemDocBridgeHandoffAuthorOutputSchema = z.object({
  summary: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
export type EcosystemDocBridgeHandoffAuthorOutput = z.infer<typeof EcosystemDocBridgeHandoffAuthorOutputSchema>

export interface EcosystemDocBridgeHandoffAuthorAgentConfig {
  adapter: AdapterFactory
  tools?: ToolDefinition[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ecosystem-doc-bridge-handoff-author',
  description: 'Doc-bridge Handoff Author — typed output agent (draft spec).',
  systemPrompt: `You are Doc-bridge Handoff Author. Handoff doc typed per agent-handoff-v1 schema

Never invent facts absent from the input — list them in gaps or openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_result exactly once. Stop.`,
  tools: ['submit_result'],
}

export function createEcosystemDocBridgeHandoffAuthorAgent(config: EcosystemDocBridgeHandoffAuthorAgentConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_result',
      description: 'Submit the typed result. Call exactly once.',
      schema: EcosystemDocBridgeHandoffAuthorOutputSchema,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<EcosystemDocBridgeHandoffAuthorOutput> {
    if (!input?.trim()) throw new Error('ecosystem-doc-bridge-handoff-author requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: input,
      parse: (a) => EcosystemDocBridgeHandoffAuthorOutputSchema.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return result
  }

  return {
    name: 'ecosystem-doc-bridge-handoff-author',
    run,
    asHandle() {
      return { name: 'ecosystem-doc-bridge-handoff-author', run: (task: string) => run(task).then((r) => JSON.stringify(r)) }
    },
  }
}
