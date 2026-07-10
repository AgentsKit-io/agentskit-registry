import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Playbook Alignment Auditor — DRAFT scaffold.
 * Pain: Registry agents must align with playbook.agentskit.io standards
 * Output: Alignment findings typed vs playbook patterns
 * Promote to validated after agent.test.ts + eval.ts pass and curator review.
 */

export const EcosystemPlaybookAlignmentAuditorOutputSchema = z.object({
  summary: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
export type EcosystemPlaybookAlignmentAuditorOutput = z.infer<typeof EcosystemPlaybookAlignmentAuditorOutputSchema>

export interface EcosystemPlaybookAlignmentAuditorAgentConfig {
  adapter: AdapterFactory
  tools?: ToolDefinition[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ecosystem-playbook-alignment-auditor',
  description: 'Playbook Alignment Auditor — typed output agent (draft spec).',
  systemPrompt: `You are Playbook Alignment Auditor. Alignment findings typed vs playbook patterns

Never invent facts absent from the input — list them in gaps or openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_result exactly once. Stop.`,
  tools: ['submit_result'],
}

export function createEcosystemPlaybookAlignmentAuditorAgent(config: EcosystemPlaybookAlignmentAuditorAgentConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_result',
      description: 'Submit the typed result. Call exactly once.',
      schema: EcosystemPlaybookAlignmentAuditorOutputSchema,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<EcosystemPlaybookAlignmentAuditorOutput> {
    if (!input?.trim()) throw new Error('ecosystem-playbook-alignment-auditor requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: input,
      parse: (a) => EcosystemPlaybookAlignmentAuditorOutputSchema.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return result
  }

  return {
    name: 'ecosystem-playbook-alignment-auditor',
    run,
    asHandle() {
      return { name: 'ecosystem-playbook-alignment-auditor', run: (task: string) => run(task).then((r) => JSON.stringify(r)) }
    },
  }
}
