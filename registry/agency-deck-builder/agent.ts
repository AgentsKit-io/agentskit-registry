import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Deck Builder — drafts a TYPED pitch/status deck from project artifacts (brief, KPIs,
 * milestone notes). Standard slide structure, and EVERY number must cite the source
 * artifact — uncited metrics are flagged, missing data becomes "data to be confirmed".
 * Always a draft.
 *
 * ```ts
 * const { deck, uncitedMetrics } = await createDeckBuilderAgent({ adapter }).run(artifacts)
 * ```
 */

const TBC = 'data to be confirmed'

export interface Slide {
  section: string
  bullets: string[]
  /** Source artifact(s) backing any numbers on this slide. */
  citations: string[]
}

export interface DeckResult {
  deck: Slide[]
  /** Slides that state a number without a citation — review before sharing. */
  uncitedMetrics: string[]
  /** Always true — a draft for the team to review. */
  requiresReview: boolean
}

export interface DeckBuilderConfig {
  adapter: AdapterFactory
  /** Override the default slide sections. */
  sections?: string[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const DEFAULT_SECTIONS = ['cover', 'context', 'what we did', 'what worked', 'what to change', 'next steps']
const NUMBER = /\d/

const Deck = z.object({
  slides: z.array(z.object({
    section: z.string(),
    bullets: z.array(z.string()),
    citations: z.array(z.string()),
  })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const buildSkill = (sections: string[]) => ({
  name: 'deck-builder',
  description: 'Drafts a typed pitch/status deck from project artifacts; every number cites its source.',
  systemPrompt: `You draft a pitch or status deck from the project brief, KPIs, and milestone notes.
Slide sections, in order: ${sections.join(', ')}.

EVERY number must cite the source artifact in that slide's citations. Do NOT invent metrics. Where
data is missing, write "${TBC}" in the bullet rather than guessing. This is a DRAFT for the team.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_deck exactly once with { slides: [{ section, bullets, citations }] }. Stop.`,
  tools: ['submit_deck'],
})

export function createDeckBuilderAgent(config: DeckBuilderConfig) {
  const sections = config.sections ?? DEFAULT_SECTIONS
  const skill = buildSkill(sections)
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_deck', description: 'Submit the deck. Call exactly once.', schema: Deck, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(artifacts: string): Promise<DeckResult> {
    if (!artifacts?.trim()) throw new Error('deck builder requires project artifacts')
    emit('deck', 'start')
    const { slides } = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `PROJECT ARTIFACTS:\n${fenceUntrustedContent(artifacts)}`,
      parse: (a) => Deck.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    // Flag any slide that quotes a number on a bullet but carries no citation (excluding TBC bullets).
    const uncitedMetrics = slides
      .filter((s) => s.citations.length === 0 && s.bullets.some((b) => NUMBER.test(b) && !b.includes(TBC)))
      .map((s) => s.section)
    emit('deck', 'ok', `${slides.length} slide(s), ${uncitedMetrics.length} uncited`)
    return { deck: slides, uncitedMetrics, requiresReview: true }
  }

  return {
    name: 'agency-deck-builder',
    run,
    asHandle() {
      return { name: 'agency-deck-builder', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
