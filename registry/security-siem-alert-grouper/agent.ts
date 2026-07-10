import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** SIEM Alert Grouper — v1 validated. Pain: Alert noise */

export interface Cluster { name: string; theme: string; items: string[] }
export interface AgentOutput { summary: string; clusters: Cluster[]; unassigned: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface SecuritySiemAlertGrouperConfig {
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
  name: 'security-siem-alert-grouper',
  description: "SIEM Alert Grouper — typed output agent (draft spec).",
  systemPrompt: `You are SIEM Alert Grouper. Alert noise. Output: Groups typed.
Group into themed clusters.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_alert_grouper exactly once. Stop.`,
  tools: ['submit_alert_grouper'],
}

export function createSecuritySiemAlertGrouperAgent(config: SecuritySiemAlertGrouperConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_alert_grouper', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('security-siem-alert-grouper requires non-empty input')
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
    name: 'security-siem-alert-grouper',
    run,
    asHandle() { return { name: 'security-siem-alert-grouper', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
