import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Copy Reviewer — reads draft creative against a brand-voice guide and returns TYPED
 * misalignments (line, current text, suggested rewrite, rationale tied to the guide) +
 * an overall assessment. It SUGGESTS, never imposes: it never rewrites the whole piece,
 * and contentious brand-intent calls set `routeToHuman` for the account lead.
 *
 * ```ts
 * const { misalignments, routeToHuman } = await createCopyReviewerAgent({ adapter })
 *   .run(`GUIDE:\n${guide}\n\nDRAFT:\n${draft}`)
 * ```
 */

export interface CopyMisalignment {
  line: string
  currentText: string
  suggestedRewrite: string
  /** Why it misaligns, tied to a specific rule in the guide. */
  rationale: string
  /** True when this is a judgment call on brand intent, not a clear rule break. */
  contentious: boolean
}

export interface CopyReviewResult {
  misalignments: CopyMisalignment[]
  overallAssessment: string
  /** True when ≥1 contentious call needs the account lead. */
  routeToHuman: boolean
}

export interface CopyReviewerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  misalignments: z.array(z.object({
    line: z.string(),
    currentText: z.string(),
    suggestedRewrite: z.string(),
    rationale: z.string(),
    contentious: z.boolean(),
  })),
  overallAssessment: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'copy-reviewer',
  description: 'Flags brand-voice misalignments in draft creative as typed suggestions (suggests, never imposes).',
  systemPrompt: `You review draft creative against the client's brand-voice guide (tone, vocabulary, banned
words, audience). For each misalignment, give: the line, the current text, a suggested rewrite, and a
rationale tied to a specific rule in the guide. Then a one-paragraph overall assessment.

SUGGEST, do not impose — NEVER rewrite the whole piece. Mark contentious=true for any item that is a
judgment call on brand INTENT rather than a clear rule break, so it routes to the account lead.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_review exactly once with { misalignments, overallAssessment }. Stop.`,
  tools: ['submit_review'],
}

export function createCopyReviewerAgent(config: CopyReviewerConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_review', description: 'Submit the copy review. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<CopyReviewResult> {
    if (!input?.trim()) throw new Error('copy reviewer requires the brand guide + draft creative')
    emit('review', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `BRAND GUIDE + DRAFT CREATIVE:\n${fenceUntrustedContent(input)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const routeToHuman = out.misalignments.some((m) => m.contentious)
    emit('review', 'ok', `${out.misalignments.length} flag(s)${routeToHuman ? ' (route to lead)' : ''}`)
    return { misalignments: out.misalignments, overallAssessment: out.overallAssessment, routeToHuman }
  }

  return {
    name: 'agency-copy-reviewer',
    run,
    asHandle() {
      return { name: 'agency-copy-reviewer', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
