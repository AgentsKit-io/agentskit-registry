import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Jurisdiction Analyzer — v1 validated. Pain: Jurisdiction risk unclear */

export interface AgentOutput { score: number; band: 'low' | 'medium' | 'high' | 'critical'; factors: string[]; rationale: string; gaps: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface LegalJurisdictionAnalyzerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  score: z.number().min(0).max(100),
  band: z.enum(['low', 'medium', 'high', 'critical']),
  factors: z.array(z.string()),
  rationale: z.string(),
  gaps: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'legal-jurisdiction-analyzer',
  description: "Jurisdiction Analyzer — typed output agent (draft spec).",
  systemPrompt: `You are Jurisdiction Analyzer. Jurisdiction risk unclear. Output: Analysis typed.
Score 0-100 with explicit factors from input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_jurisdiction_analyzer exactly once. Stop.`,
  tools: ['submit_jurisdiction_analyzer'],
}

export function createLegalJurisdictionAnalyzerAgent(config: LegalJurisdictionAnalyzerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_jurisdiction_analyzer', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('legal-jurisdiction-analyzer requires non-empty input')
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
    name: 'legal-jurisdiction-analyzer',
    run,
    asHandle() { return { name: 'legal-jurisdiction-analyzer', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
