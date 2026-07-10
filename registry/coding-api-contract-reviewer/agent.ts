import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * API Contract Reviewer — classifies OpenAPI/GraphQL diffs as breaking vs safe.
 */

export type ChangeKind = 'breaking' | 'non-breaking' | 'unknown'

export interface ContractChange {
  id: string
  kind: ChangeKind
  path: string
  message: string
  source?: string
  recommendation?: string
}

export interface ContractReviewResult {
  summary: string
  changes: ContractChange[]
  gaps: string[]
  openQuestions: string[]
  requiresReview: boolean
}

export interface CodingApiContractReviewerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  summary: z.string(),
  changes: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(['breaking', 'non-breaking', 'unknown']),
      path: z.string(),
      message: z.string(),
      source: z.string().optional(),
      recommendation: z.string().optional(),
    }),
  ),
  gaps: z.array(z.string()).default([]),
  openQuestions: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

function applySafetyNet(input: string, out: z.infer<typeof Output>): z.infer<typeof Output> {
  const changes = [...out.changes]
  const breakingSignals = [
    /\bremoved\b.*\b(field|endpoint|operation|enum value)\b/i,
    /\brequired\b.*\badded\b/i,
    /\btype changed\b/i,
    /\b404\b.*\b200\b/i,
  ]
  if (breakingSignals.some((re) => re.test(input))) {
    const hasBreaking = changes.some((c) => c.kind === 'breaking')
    if (!hasBreaking) {
      changes.push({
        id: 'safety-breaking',
        kind: 'breaking',
        path: 'contract',
        message: 'Input signals breaking API change — verify consumer impact',
        source: 'input signal',
        recommendation: 'Bump major version or add compatibility shim',
      })
    }
  }
  return { ...out, changes }
}

const skill = {
  name: 'coding-api-contract-reviewer',
  description: 'Reviews API contract diffs — breaking vs non-breaking changes.',
  systemPrompt: `You review API contract diffs (OpenAPI, GraphQL schema, protobuf, typed SDK exports).

Output: { summary, changes[], gaps[], openQuestions[] }.
Each change: id, kind (breaking|non-breaking|unknown), path (operation/field/route), message, source, recommendation.

Breaking examples: removed field/endpoint, type change, new required field, narrowed enum, auth scope change.
Non-breaking: optional field added, new endpoint, documentation-only.

Cite the diff hunk or line in source. NEVER invent changes not shown in input.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_contract_reviewer exactly once. Stop.`,
  tools: ['submit_contract_reviewer'],
}

export function createCodingApiContractReviewerAgent(config: CodingApiContractReviewerConfig) {
  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_contract_reviewer',
      description: 'Submit contract review. Call exactly once.',
      schema: Output,
      toJsonSchema: toJson,
      async execute() { return 'recorded' },
    }) as ToolDefinition

  async function run(input: string): Promise<ContractReviewResult> {
    if (!input?.trim()) throw new Error('coding-api-contract-reviewer requires non-empty input')
    const parsed = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CONTRACT DIFF:\n${fenceUntrustedContent(input)}`,
      parse: (a) => applySafetyNet(input, Output.parse(a)),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 4,
    })
    return { ...parsed, requiresReview: true }
  }

  return {
    name: 'coding-api-contract-reviewer',
    run,
    asHandle() {
      return { name: 'coding-api-contract-reviewer', run: (t: string) => run(t).then((r) => JSON.stringify(r)) }
    },
  }
}