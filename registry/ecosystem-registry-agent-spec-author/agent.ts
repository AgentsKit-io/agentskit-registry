import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Registry Agent Spec Author — drafts catalog manifest specs before scaffold.
 */

export interface AgentSpecDraft {
  id?: string
  title?: string
  pain: string
  output: string
  gates: string[]
  zodOutline: string
  tags: string[]
}

export interface SpecAuthorResult extends AgentSpecDraft {
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface EcosystemRegistryAgentSpecAuthorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  pain: z.string().min(1),
  output: z.string().min(1),
  gates: z.array(z.string()).min(1),
  zodOutline: z.string().min(1),
  tags: z.array(z.string()).default([]),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ecosystem-registry-agent-spec-author',
  description: 'Drafts registry catalog specs: pain, output, gates, zod outline.',
  systemPrompt: `You author registry catalog specs for new AgentsKit agents.

Output: { id?, title?, pain, output, gates[], zodOutline, tags[], gaps[], openQuestions[] }.

- pain: one sentence user/job pain (no fluff)
- output: typed deliverable shape (what invokeStructured returns)
- gates: include typed-output, never-invent, always-draft; add domain gates when justified
- zodOutline: pseudocode zod object fields (not full TS)
- tags: category + domain tags from input

If vertical/category unclear → gaps. NEVER invent compliance scope or integrations.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_spec_author exactly once. Stop.`,
  tools: ['submit_spec_author'],
}

export function createEcosystemRegistryAgentSpecAuthorAgent(config: EcosystemRegistryAgentSpecAuthorConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_spec_author',
      description: 'Submit agent spec draft. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<SpecAuthorResult> {
    if (!input?.trim()) throw new Error('ecosystem-registry-agent-spec-author requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `IDEA:\n${fenceUntrustedContent(input)}`,
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
    name: 'ecosystem-registry-agent-spec-author',
    run,
    asHandle() {
      return { name: 'ecosystem-registry-agent-spec-author', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}