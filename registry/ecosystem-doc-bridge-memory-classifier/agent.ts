import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Classifies private notes into doc-bridge memory candidates (promote | hold | reject).
 * Deterministic safety net flags secrets and private emails — never promotes those.
 */

export type MemoryRoute = 'promote' | 'hold' | 'reject'

export interface MemoryCandidateDecision {
  id: string
  fact: string
  route: MemoryRoute
  rationale: string
  suggestedDocTarget?: string
  safetyFlags: string[]
}

export interface ClassifierResult {
  candidates: MemoryCandidateDecision[]
  gaps: string[]
  requiresReview: boolean
}

export interface EcosystemDocBridgeMemoryClassifierConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Decision = z.object({
  id: z.string(),
  fact: z.string(),
  route: z.enum(['promote', 'hold', 'reject']),
  rationale: z.string(),
  suggestedDocTarget: z.string().optional(),
  safetyFlags: z.array(z.string()).default([]),
})
const Output = z.object({
  candidates: z.array(Decision).min(1),
  gaps: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const SECRET = /\b(?:api[_-]?key|token|secret|password)\s*[:=]\s*\S+/i
const EMAIL = /\b[A-Z0-9._%+-]+@(?!example\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/i

function applySafetyNet(raw: string, out: z.infer<typeof Output>): z.infer<typeof Output> {
  return {
    ...out,
    candidates: out.candidates.map((c) => {
      const flags = [...c.safetyFlags]
      if (SECRET.test(c.fact) || SECRET.test(raw)) flags.push('secret-pattern')
      if (EMAIL.test(c.fact) || EMAIL.test(raw)) flags.push('private-email')
      if (flags.length) return { ...c, route: 'reject' as const, safetyFlags: [...new Set(flags)] }
      return c
    }),
  }
}

const skill = {
  name: 'ecosystem-doc-bridge-memory-classifier',
  description: 'Classifies notes into doc-bridge memory candidates with promote/hold/reject routes.',
  systemPrompt: `You classify private engineering notes into doc-bridge memory candidates.
Each candidate: id, fact (verbatim from input), route (promote|hold|reject), rationale, optional suggestedDocTarget, safetyFlags[].

Routes:
- promote: durable project convention worth public docs
- hold: useful but needs more context
- reject: noise, scratch, or unsafe to publish

NEVER invent facts. One candidate per distinct fact in the input. Missing context → gaps[].

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_memory_classification exactly once. Stop.`,
  tools: ['submit_memory_classification'],
}

export function createEcosystemDocBridgeMemoryClassifierAgent(config: EcosystemDocBridgeMemoryClassifierConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_memory_classification',
      description: 'Submit memory classification. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(notes: string): Promise<ClassifierResult> {
    if (!notes?.trim()) throw new Error('memory classifier requires non-empty notes')
    const parsed = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `NOTES:\n${fenceUntrustedContent(notes)}`,
      parse: (a) => applySafetyNet(notes, Output.parse(a)),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return { ...parsed, requiresReview: true }
  }

  return {
    name: 'ecosystem-doc-bridge-memory-classifier',
    run,
    asHandle() {
      return { name: 'ecosystem-doc-bridge-memory-classifier', run: (task: string) => run(task).then((r) => JSON.stringify(r)) }
    },
  }
}