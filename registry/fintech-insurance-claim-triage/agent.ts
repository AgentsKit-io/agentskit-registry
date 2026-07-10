import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Insurance Claim Triage — v1 validated. Pain: Claim intake slow */

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export interface AgentOutput { category: string; severity: Severity; queue: string; rationale: string; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface FintechInsuranceClaimTriageConfig {
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
  name: 'fintech-insurance-claim-triage',
  description: "Insurance Claim Triage — typed output agent (draft spec).",
  systemPrompt: `You are Insurance Claim Triage. Claim intake slow. Output: Triage typed.
Classify with category, severity, queue, rationale. Gaps for missing input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_claim_triage exactly once. Stop.`,
  tools: ['submit_claim_triage'],
}

export function createFintechInsuranceClaimTriageAgent(config: FintechInsuranceClaimTriageConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_claim_triage', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('fintech-insurance-claim-triage requires non-empty input')
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
    name: 'fintech-insurance-claim-triage',
    run,
    asHandle() { return { name: 'fintech-insurance-claim-triage', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
