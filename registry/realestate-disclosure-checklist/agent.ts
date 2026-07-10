import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Disclosure Checklist — Checklist typed
 * Pain: Disclosures missed
 * Status: alpha (auto-implemented; requires human review before validated).
 */

export interface CheckItem { item: string; pass: boolean; notes: string }
export interface AgentOutput { summary: string; items: CheckItem[]; gaps: string[] }

export interface AgentResult extends AgentOutput {
  requiresReview: boolean
}

export interface RealestateDisclosureChecklistConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const CheckItem = z.object({ item: z.string(), pass: z.boolean(), notes: z.string() })
const Output = z.object({
  summary: z.string(),
  items: z.array(CheckItem).min(1),
  gaps: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7



const skill = {
  name: 'realestate-disclosure-checklist',
  description: "Disclosure Checklist — typed output agent (draft spec).",
  systemPrompt: `You are Disclosure Checklist. Disclosures missed. Expected output: Checklist typed.

Produce a checklist with pass/fail per item and notes.
NEVER invent facts absent from the input — use gaps and openQuestions.
Output is always a draft for human review.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_disclosure_checklist exactly once with the structured result. Stop.`,
  tools: ['submit_disclosure_checklist'],
}

export function createRealestateDisclosureChecklistAgent(config: RealestateDisclosureChecklistConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_disclosure_checklist',
      description: 'Submit the typed result. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<AgentResult> {
    if (!input?.trim()) throw new Error('realestate-disclosure-checklist requires non-empty input')
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
    name: 'realestate-disclosure-checklist',
    run,
    asHandle() {
      return { name: 'realestate-disclosure-checklist', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
