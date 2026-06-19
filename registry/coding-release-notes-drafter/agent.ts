import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Release Notes Drafter — turns the list of merged PRs since the last tag into TYPED,
 * grouped release notes (Feature / Fix / Performance / Docs / Internal). Every entry
 * cites its PR number; never invents a merge not in the input. Always a draft for the
 * release manager. Also renders a ready-to-paste markdown block.
 *
 * ```ts
 * const { groups, markdown } = await createReleaseNotesDrafterAgent({ adapter }).run(mergedPrs)
 * ```
 */

export type ChangeType = 'Feature' | 'Fix' | 'Performance' | 'Docs' | 'Internal'

export interface ReleaseEntry {
  text: string
  /** PR number backing this entry. */
  pr: number
}

export interface ReleaseGroup {
  type: ChangeType
  entries: ReleaseEntry[]
}

export interface ReleaseNotesResult {
  groups: ReleaseGroup[]
  /** Markdown rendering of the grouped notes, ready to paste. */
  markdown: string
  requiresReview: boolean
}

export interface ReleaseNotesDrafterConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  groups: z.array(z.object({
    type: z.enum(['Feature', 'Fix', 'Performance', 'Docs', 'Internal']),
    entries: z.array(z.object({ text: z.string(), pr: z.number().int() })),
  })),
  markdown: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'release-notes-drafter',
  description: 'Drafts typed, grouped release notes from merged PRs (cites PR numbers, never invents).',
  systemPrompt: `You draft release notes from the list of merged PRs (title, body, labels) since the last
tag. Group by change type (Feature | Fix | Performance | Docs | Internal), inferred from labels + title
prefix. Within each group, lead with user-facing changes and end with internals. CITE each entry with
its PR number. NEVER invent a merge that isn't in the input. Then render a markdown block of the notes.

This is a DRAFT for the release manager to confirm before publishing.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_notes exactly once with { groups, markdown }. Stop.`,
  tools: ['submit_notes'],
}

export function createReleaseNotesDrafterAgent(config: ReleaseNotesDrafterConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_notes', description: 'Submit the release notes. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(mergedPrs: string): Promise<ReleaseNotesResult> {
    if (!mergedPrs?.trim()) throw new Error('release notes drafter requires the list of merged PRs')
    emit('draft', 'start')
    const { groups, markdown } = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `MERGED PRS SINCE LAST TAG:\n${fenceUntrustedContent(mergedPrs)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const entryCount = groups.reduce((n, g) => n + g.entries.length, 0)
    emit('draft', 'ok', `${groups.length} group(s), ${entryCount} entr(ies)`)
    return { groups, markdown, requiresReview: true }
  }

  return {
    name: 'coding-release-notes-drafter',
    run,
    asHandle() {
      return { name: 'coding-release-notes-drafter', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
