import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Brief Generator — drafts a TYPED creative brief from client kickoff notes. Pulls facts
 * only from the notes (never invents client details); any field without input becomes
 * "to be confirmed with the client" and is listed in `toBeConfirmed`. Always a draft.
 *
 * ```ts
 * const { brief, toBeConfirmed } = await createBriefGeneratorAgent({ adapter }).run(kickoffNotes)
 * ```
 */

const TBC = 'to be confirmed with the client'

export interface CreativeBrief {
  clientAndProduct: string
  audience: string
  keyInsight: string
  singleMindedProposition: string
  mandatories: string[]
  tone: string
  deliverables: string[]
  timeline: string
}

export interface BriefResult {
  brief: CreativeBrief
  /** Brief fields the notes didn't cover (filled with the TBC placeholder). */
  toBeConfirmed: string[]
  /** Always true — a draft for the team to confirm with the client. */
  requiresReview: boolean
}

export interface BriefGeneratorConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Brief = z.object({
  clientAndProduct: z.string(),
  audience: z.string(),
  keyInsight: z.string(),
  singleMindedProposition: z.string(),
  mandatories: z.array(z.string()),
  tone: z.string(),
  deliverables: z.array(z.string()),
  timeline: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'brief-generator',
  description: 'Drafts a typed creative brief from client kickoff notes (never invents details).',
  systemPrompt: `You draft a creative brief from client kickoff notes. Fields: client + product; audience;
key insight; single-minded proposition; mandatories; tone; deliverables; timeline.

Pull facts ONLY from the notes — NEVER invent client details. If a field lacks input, set it to
exactly "${TBC}" rather than fabricating. Voice: clear, action-oriented, agency-standard; avoid
corporate jargon. This is a DRAFT for the team to confirm with the client.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_brief exactly once with the structured fields. Stop.`,
  tools: ['submit_brief'],
}

export function createBriefGeneratorAgent(config: BriefGeneratorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_brief', description: 'Submit the creative brief. Call exactly once.', schema: Brief, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(notes: string): Promise<BriefResult> {
    if (!notes?.trim()) throw new Error('brief generator requires non-empty kickoff notes')
    emit('brief', 'start')
    const brief = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CLIENT KICKOFF NOTES:\n${fenceUntrustedContent(notes)}`,
      parse: (a) => Brief.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    // Surface the gaps the model flagged TBC so the team knows what to chase.
    const toBeConfirmed = Object.entries(brief)
      .filter(([, v]) => (Array.isArray(v) ? v.some((x) => x.includes(TBC)) : String(v).includes(TBC)))
      .map(([k]) => k)
    emit('brief', 'ok', `${toBeConfirmed.length} field(s) TBC`)
    return { brief, toBeConfirmed, requiresReview: true }
  }

  return {
    name: 'agency-brief-generator',
    run,
    asHandle() {
      return { name: 'agency-brief-generator', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
