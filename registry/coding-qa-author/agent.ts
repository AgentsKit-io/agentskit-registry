import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * QA Author — turns a PRD's acceptance criteria into TYPED Vitest spec stubs (one or more
 * `describe`/`it` blocks per criterion, each referencing its criterion number). Returns
 * `{ specs: [{ path, body }] }` so a downstream agent can write the files verbatim, and
 * flags any criterion that produced no spec rather than silently dropping coverage.
 *
 * ```ts
 * const { specs, uncovered } = await createQaAuthorAgent({ adapter }).run(prdJson)
 * ```
 */

export interface SpecFile {
  path: string
  body: string
  /** Criterion number(s) this spec covers. */
  criteria: number[]
}

export interface QaResult {
  specs: SpecFile[]
  /** Criterion numbers no spec covered — review before relying on the suite. */
  uncovered: number[]
  requiresReview: boolean
}

export interface QaAuthorConfig {
  adapter: AdapterFactory
  /** Total criteria in the PRD, used to compute `uncovered`. Optional. */
  criteriaCount?: number
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  specs: z.array(z.object({
    path: z.string(),
    body: z.string(),
    criteria: z.array(z.number().int()),
  })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'qa-author',
  description: 'Turns PRD acceptance criteria into typed Vitest spec stubs (one+ per criterion).',
  systemPrompt: `You write Vitest test suites for a TypeScript monorepo. For EACH acceptance criterion in
the input PRD, produce one or more spec stubs using describe and it blocks that read like executable
documentation. Each it block must reference the criterion by number, contain a meaningful assertion
(or a clear assertion comment), and compile without error. Match the project's file-naming pattern.

Return specs as { path, body, criteria: [criterionNumbers] }. Do not skip a criterion silently.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_specs exactly once with { specs }. Stop.`,
  tools: ['submit_specs'],
}

export function createQaAuthorAgent(config: QaAuthorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_specs', description: 'Submit the spec stubs. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(prd: string): Promise<QaResult> {
    if (!prd?.trim()) throw new Error('qa author requires a PRD')
    emit('specs', 'start')
    const { specs } = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `PRD:\n${fenceUntrustedContent(prd)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    // Flag criteria with no spec (only when the caller told us how many to expect).
    const covered = new Set(specs.flatMap((s) => s.criteria))
    const uncovered = config.criteriaCount
      ? Array.from({ length: config.criteriaCount }, (_, i) => i + 1).filter((n) => !covered.has(n))
      : []
    emit('specs', 'ok', `${specs.length} spec(s), ${uncovered.length} uncovered`)
    return { specs, uncovered, requiresReview: true }
  }

  return {
    name: 'coding-qa-author',
    run,
    asHandle() {
      return { name: 'coding-qa-author', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
