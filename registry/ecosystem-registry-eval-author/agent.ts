import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Registry Eval Author — drafts @agentskit/eval suite cases for registry agents.
 */

export interface EvalCaseDraft {
  name?: string
  input: string
  expectedDescription: string
  rationale: string
}

export interface EvalAuthorResult {
  suiteName: string
  cases: EvalCaseDraft[]
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface EcosystemRegistryEvalAuthorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  suiteName: z.string().min(1),
  cases: z.array(
    z.object({
      name: z.string().optional(),
      input: z.string().min(1),
      expectedDescription: z.string().min(1),
      rationale: z.string().min(1),
    }),
  ).min(1),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ecosystem-registry-eval-author',
  description: 'Drafts eval.ts cases for registry agents.',
  systemPrompt: `You author eval suites for AgentsKit registry agents (@agentskit/eval).

Output: { suiteName, cases[], gaps[], openQuestions[] }.
Each case:
- input: realistic user/task input grounded in the agent's pain
- expectedDescription: plain-language assertion (e.g. "output contains findings array with severity high")
- rationale: why this case guards the agent's contract
- name: optional short label

Cover: happy path, thin input → gaps, safety/red-flag input, domain-specific edge.
NEVER invent agent capabilities not described in input.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_eval_author exactly once. Stop.`,
  tools: ['submit_eval_author'],
}

export function createEcosystemRegistryEvalAuthorAgent(config: EcosystemRegistryEvalAuthorConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_eval_author',
      description: 'Submit eval suite draft. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<EvalAuthorResult> {
    if (!input?.trim()) throw new Error('ecosystem-registry-eval-author requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `AGENT CONTEXT:\n${fenceUntrustedContent(input)}`,
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
    name: 'ecosystem-registry-eval-author',
    run,
    asHandle() {
      return { name: 'ecosystem-registry-eval-author', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}