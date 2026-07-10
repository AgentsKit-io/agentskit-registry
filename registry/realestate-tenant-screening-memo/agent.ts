import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Tenant Screening Memo — v1 validated. Pain: Screening slow */

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export interface AgentOutput { category: string; severity: Severity; queue: string; rationale: string; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface RealestateTenantScreeningMemoConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  category: z.string(),
  severity: z.enum(['critical', 'high', 'medium', 'low']),
  queue: z.string(),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, o: z.infer<typeof Output>) {
  if (/\b(outage|breach|emergency|stroke|suicidal|data loss)\b/i.test(input) && o.severity !== 'critical')
    return { ...o, severity: 'critical' as const, queue: 'escalation', rationale: o.rationale + ' [safety-net]' }
  return o
}

const skill = {
  name: 'realestate-tenant-screening-memo',
  description: "Tenant Screening Memo — typed output agent (draft spec).",
  systemPrompt: `You are Tenant Screening Memo. Screening slow. Output: Memo typed.
Classify with category, severity, queue, rationale. Gaps for missing input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_screening_memo exactly once. Stop.`,
  tools: ['submit_screening_memo'],
}

export function createRealestateTenantScreeningMemoAgent(config: RealestateTenantScreeningMemoConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_screening_memo', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('realestate-tenant-screening-memo requires non-empty input')
    const result = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `INPUT:\n${fenceUntrustedContent(input)}`,
      parse: (a) => applySafetyNet(input, Output.parse(a)),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return { ...result, requiresReview: true }
  }
  return {
    name: 'realestate-tenant-screening-memo',
    run,
    asHandle() { return { name: 'realestate-tenant-screening-memo', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
