import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Compliance Checklist — v1 validated. Pain: Compliance ad-hoc */

export interface CheckItem { item: string; pass: boolean; notes: string }
export interface AgentOutput { summary: string; items: CheckItem[]; gaps: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface OpsComplianceChecklistConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  items: z.array(z.object({ item: z.string(), pass: z.boolean(), notes: z.string() })).min(1),
  gaps: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'ops-compliance-checklist',
  description: "Compliance Checklist — typed output agent (draft spec).",
  systemPrompt: `You are Compliance Checklist. Compliance ad-hoc. Output: Checklist typed.
Checklist with pass/fail per item.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_compliance_checklist exactly once. Stop.`,
  tools: ['submit_compliance_checklist'],
}

export function createOpsComplianceChecklistAgent(config: OpsComplianceChecklistConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_compliance_checklist', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('ops-compliance-checklist requires non-empty input')
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
    name: 'ops-compliance-checklist',
    run,
    asHandle() { return { name: 'ops-compliance-checklist', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
