import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/** Secrets Leak Scanner — v1 validated. Pain: Secrets in repos */

export interface Finding { id: string; severity: 'critical' | 'high' | 'medium' | 'low' | 'info'; message: string; source?: string; recommendation?: string }
export interface AgentOutput { summary: string; findings: Finding[]; gaps: string[]; openQuestions: string[] }
export interface AgentResult extends AgentOutput { requiresReview: boolean }
export interface DevopsSecretsLeakScannerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  findings: z.array(z.object({
    id: z.string(), severity: z.enum(['critical', 'high', 'medium', 'low', 'info']),
    message: z.string(), source: z.string().optional(), recommendation: z.string().optional(),
  })),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'devops-secrets-leak-scanner',
  description: "Secrets Leak Scanner — typed output agent (draft spec).",
  systemPrompt: `You are Secrets Leak Scanner. Secrets in repos. Output: Findings typed.
Actionable findings citing input sources. No invented issues.
NEVER invent facts — gaps and openQuestions for missing input. Always draft for human review.
${UNTRUSTED_CONTENT_DIRECTIVE}
Call submit_leak_scanner exactly once. Stop.`,
  tools: ['submit_leak_scanner'],
}

export function createDevopsSecretsLeakScannerAgent(config: DevopsSecretsLeakScannerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_leak_scanner', description: 'Submit result. Once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('devops-secrets-leak-scanner requires non-empty input')
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
    name: 'devops-secrets-leak-scanner',
    run,
    asHandle() { return { name: 'devops-secrets-leak-scanner', run: (t: string) => run(t).then((r) => JSON.stringify(r)) } },
  }
}
