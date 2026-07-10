import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** CI Failure Grouper — v1 validated. Pain: CI noise */

export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface DevopsCiFailureGrouperConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  clusters: z.array(z.object({ name: z.string(), theme: z.string(), items: z.array(z.string()) })).min(1),
  unassigned: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'devops-ci-failure-grouper',
  description: "CI Failure Grouper — typed output agent (draft spec).",
  systemPrompt: `You are CI Failure Grouper. CI noise. Output: Groups typed.
Group into themed clusters.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_failure_grouper exactly once. Stop.`,
  tools: ['submit_failure_grouper'],
}

export function createDevopsCiFailureGrouperAgent(config: DevopsCiFailureGrouperConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_failure_grouper', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('devops-ci-failure-grouper requires non-empty input')
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
    name: 'devops-ci-failure-grouper',
    run,
    asHandle() { return { name: 'devops-ci-failure-grouper', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
