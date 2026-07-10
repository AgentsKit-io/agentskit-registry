import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * CI Failure Grouper — Groups typed
 * Pain: CI noise
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface DevopsCiFailureGrouperConfig {
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
  name: 'devops-ci-failure-grouper',
  description: "CI Failure Grouper — typed output agent (draft spec).",
  systemPrompt: `You are CI Failure Grouper. CI noise. Expected output: Groups typed.

Group items into named clusters with themes.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_failure_grouper exactly once with the structured result. Stop.`,
  tools: ['submit_failure_grouper'],
}

export function createDevopsCiFailureGrouperAgent(config: DevopsCiFailureGrouperConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_failure_grouper',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('devops-ci-failure-grouper requires non-empty input')
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
    name: 'devops-ci-failure-grouper',
    run,
    asHandle() {
      return { name: 'devops-ci-failure-grouper', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
