import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Doc-bridge Corpus Scanner — v1 validated. Pain: doc-bridge needs corpus classification before indexing */

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export interface AgentOutput { category: string; severity: Severity; queue: string; rationale: string; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface EcosystemDocBridgeCorpusScannerConfig {
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
  name: 'ecosystem-doc-bridge-corpus-scanner',
  description: "Doc-bridge Corpus Scanner — typed output agent (draft spec).",
  systemPrompt: `You are Doc-bridge Corpus Scanner. doc-bridge needs corpus classification before indexing. Output: Scan report typed: paths, doc types, staleness.
Classify with category, severity, queue, rationale. Gaps for missing input.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_corpus_scanner exactly once. Stop.`,
  tools: ['submit_corpus_scanner'],
}

export function createEcosystemDocBridgeCorpusScannerAgent(config: EcosystemDocBridgeCorpusScannerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_corpus_scanner', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('ecosystem-doc-bridge-corpus-scanner requires non-empty input')
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
    name: 'ecosystem-doc-bridge-corpus-scanner',
    run,
    asHandle() { return { name: 'ecosystem-doc-bridge-corpus-scanner', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
