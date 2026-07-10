import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Churn Risk Scorer — v1 validated. Pain: Silent churn */

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export interface AgentOutput { category: string; severity: Severity; queue: string; rationale: string; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface SupportChurnRiskScorerConfig {
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
  name: 'support-churn-risk-scorer',
  description: "Churn Risk Scorer — typed output agent (draft spec).",
  systemPrompt: `You are Churn Risk Scorer. Silent churn. Output: Risk score typed.
Classify with category, severity, queue, rationale. Gaps for missing input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_risk_scorer exactly once. Stop.`,
  tools: ['submit_risk_scorer'],
}

export function createSupportChurnRiskScorerAgent(config: SupportChurnRiskScorerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_risk_scorer', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('support-churn-risk-scorer requires non-empty input')
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
    name: 'support-churn-risk-scorer',
    run,
    asHandle() { return { name: 'support-churn-risk-scorer', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
