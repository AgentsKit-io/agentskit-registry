import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Copy Author — produces exactly THREE distinct, TYPED copy variants from a structured
 * brief (+ optional competitive context): `bold` (challenger), `warm` (story-led),
 * `precise` (evidence-first). Every metric must come from the brief — no invented
 * numbers; bodies are length-checked; over-length variants are flagged, not silently cut.
 *
 * ```ts
 * const { variants } = await createCopyAuthorAgent({ adapter }).run(structuredBrief)
 * ```
 */

export type VariantId = 'bold' | 'warm' | 'precise'

export interface CopyVariant {
  variantId: VariantId
  headline: string
  subheadline: string
  body: string
  cta: string
  channel: string
  targetPersona: string
  toneRationale: string
}

export interface CopyResult {
  variants: CopyVariant[]
  /** Variants whose body exceeded maxWords — review before use. */
  overLength: VariantId[]
  requiresReview: boolean
}

export interface CopyAuthorConfig {
  adapter: AdapterFactory
  /** Max words per variant body (default 150). */
  maxWords?: number
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Variant = z.object({
  variantId: z.enum(['bold', 'warm', 'precise']),
  headline: z.string(),
  subheadline: z.string(),
  body: z.string(),
  cta: z.string(),
  channel: z.string(),
  targetPersona: z.string(),
  toneRationale: z.string(),
})
const Output = z.object({ variants: z.array(Variant).length(3) })
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const buildSkill = (maxWords: number) => ({
  name: 'copy-author',
  description: 'Produces exactly three typed copy variants (bold / warm / precise) from a brief.',
  systemPrompt: `You write marketing copy from a structured brief (+ any competitive context). Produce
EXACTLY three variants:
- bold: challenger framing, provocative headline, benefit-led CTA. Best for LinkedIn.
- warm: story-led opening, empathy with the reader's pain, personal CTA. Best for email.
- precise: evidence-first, specific metrics cited, technical clarity. Best for product pages.

Each variant: variantId, headline, subheadline, body, cta, channel, targetPersona, toneRationale.
Rules: never use banned phrases from the brand voice guide; EVERY metric must come from the brief or
competitive report — no invented numbers; CTAs match the funnel stage; body ≤ ${maxWords} words.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_variants exactly once with { variants: [bold, warm, precise] }. Stop.`,
  tools: ['submit_variants'],
})

const wordCount = (s: string): number => s.trim().split(/\s+/).filter(Boolean).length

export function createCopyAuthorAgent(config: CopyAuthorConfig) {
  const maxWords = config.maxWords ?? 150
  const skill = buildSkill(maxWords)
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_variants', description: 'Submit the three copy variants. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(brief: string): Promise<CopyResult> {
    if (!brief?.trim()) throw new Error('copy author requires a structured brief')
    emit('write', 'start')
    const { variants } = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `STRUCTURED BRIEF (+ competitive context):\n${fenceUntrustedContent(brief)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const overLength = variants.filter((v) => wordCount(v.body) > maxWords).map((v) => v.variantId)
    emit('write', 'ok', `3 variants, ${overLength.length} over length`)
    return { variants, overLength, requiresReview: true }
  }

  return {
    name: 'marketing-copy-author',
    run,
    asHandle() {
      return { name: 'marketing-copy-author', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
