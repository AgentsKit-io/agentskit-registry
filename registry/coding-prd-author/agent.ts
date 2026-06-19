import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * PRD Author — transforms a free-form product description into a TYPED PRD engineers can
 * act on: problem, users, 3–5 testable acceptance criteria, out-of-scope, open questions.
 * Never invents business logic — anything absent from the input becomes an open question.
 *
 * ```ts
 * const { prd } = await createPrdAuthorAgent({ adapter }).run(productDescription)
 * ```
 */

export interface PRD {
  problem: string
  users: string[]
  /** 3–5 testable acceptance criteria. */
  criteria: string[]
  outOfScope: string[]
  openQuestions: string[]
}

export interface PrdResult {
  prd: PRD
  requiresReview: boolean
}

export interface PrdAuthorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Prd = z.object({
  problem: z.string(),
  users: z.array(z.string()),
  criteria: z.array(z.string()).min(1).max(8),
  outOfScope: z.array(z.string()),
  openQuestions: z.array(z.string()),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'prd-author',
  description: 'Transforms a product description into a typed, testable PRD (never invents logic).',
  systemPrompt: `You are a senior PM in a TypeScript monorepo. Transform a free-form product description
into a PRD engineers can act on without ambiguity. Fields: problem statement; target users; acceptance
criteria (3–5 TESTABLE items); out-of-scope items; open questions.

NEVER invent business logic absent from the input. Anything the input doesn't specify becomes an open
question, not a guess.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_prd exactly once with { problem, users, criteria, outOfScope, openQuestions }. Stop.`,
  tools: ['submit_prd'],
}

export function createPrdAuthorAgent(config: PrdAuthorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_prd', description: 'Submit the PRD. Call exactly once.', schema: Prd, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(description: string): Promise<PrdResult> {
    if (!description?.trim()) throw new Error('prd author requires a non-empty product description')
    emit('prd', 'start')
    const prd = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `PRODUCT DESCRIPTION:\n${fenceUntrustedContent(description)}`,
      parse: (a) => Prd.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('prd', 'ok', `${prd.criteria.length} criteria, ${prd.openQuestions.length} open`)
    return { prd, requiresReview: true }
  }

  return {
    name: 'coding-prd-author',
    run,
    asHandle() {
      return { name: 'coding-prd-author', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
