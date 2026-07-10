import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Registry Agent Spec Author — DRAFT scaffold.
 * Pain: New agents need consistent specs before scaffold
 * Output: Spec typed: pain, output, gates, zod shape outline
 * Promote to validated after agent.test.ts + eval.ts pass and curator review.
 */

export const EcosystemRegistryAgentSpecAuthorOutputSchema = z.object({
  summary: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
export type EcosystemRegistryAgentSpecAuthorOutput = z.infer<typeof EcosystemRegistryAgentSpecAuthorOutputSchema>

export interface EcosystemRegistryAgentSpecAuthorAgentConfig {
  adapter: AdapterFactory
  tools?: ToolDefinition[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ecosystem-registry-agent-spec-author',
  description: 'Registry Agent Spec Author — typed output agent (draft spec).',
  systemPrompt: `You are Registry Agent Spec Author. Spec typed: pain, output, gates, zod shape outline

Never invent facts absent from the input — list them in gaps or openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_result exactly once. Stop.`,
  tools: ['submit_result'],
}

export function createEcosystemRegistryAgentSpecAuthorAgent(config: EcosystemRegistryAgentSpecAuthorAgentConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_result',
      description: 'Submit the typed result. Call exactly once.',
      schema: EcosystemRegistryAgentSpecAuthorOutputSchema,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<EcosystemRegistryAgentSpecAuthorOutput> {
    if (!input?.trim()) throw new Error('ecosystem-registry-agent-spec-author requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: input,
      parse: (a) => EcosystemRegistryAgentSpecAuthorOutputSchema.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return result
  }

  return {
    name: 'ecosystem-registry-agent-spec-author',
    run,
    asHandle() {
      return { name: 'ecosystem-registry-agent-spec-author', run: (task: string) => run(task).then((r) => JSON.stringify(r)) }
    },
  }
}
