import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Brief Analyst — the intake step of a campaign studio. Reads an incoming campaign brief
 * and produces a TYPED structured brief that downstream agents reference. Never invents
 * client details; missing required fields are listed in `gaps` (ask, don't guess); pass a
 * `voiceGuide` and it flags brief language that conflicts with it.
 *
 * ```ts
 * const { brief, gaps } = await createBriefAnalystAgent({ adapter }).run(incomingBrief)
 * ```
 */

export interface CampaignBrief {
  clientProduct: string
  /** awareness | conversion | retention. */
  objective: string
  audience: string
  /** ≤ 3 key messages. */
  keyMessages: string[]
  tone: string
  channels: string[]
  timeline: string
  mandatories: string[]
  /** Brief language that conflicts with the supplied voice guide. */
  voiceFlags: string[]
}

export interface BriefAnalysisResult {
  brief: CampaignBrief
  /** Required fields the brief didn't supply — clarify, don't guess. */
  gaps: string[]
  requiresReview: boolean
}

export interface BriefAnalystConfig {
  adapter: AdapterFactory
  /** Optional brand-voice guide; brief language conflicting with it is flagged. */
  voiceGuide?: string
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  clientProduct: z.string(),
  objective: z.enum(['awareness', 'conversion', 'retention', 'unspecified']),
  audience: z.string(),
  keyMessages: z.array(z.string()).max(3),
  tone: z.string(),
  channels: z.array(z.string()),
  timeline: z.string(),
  mandatories: z.array(z.string()),
  voiceFlags: z.array(z.string()),
  gaps: z.array(z.string()),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'brief-analyst',
  description: 'Extracts a typed structured campaign brief from an incoming brief (never invents).',
  systemPrompt: `You are the intake analyst for a campaign studio. Read the incoming campaign brief and
produce a structured brief downstream agents will reference. Extract: client/product; objective
(awareness|conversion|retention, else "unspecified"); audience; key messages (≤3); tone; channels;
timeline; mandatories (legal lines, brand bans). If a VOICE GUIDE is provided, flag any brief language
that conflicts with it in voiceFlags.

You do NOT write copy. NEVER invent client details or audience demographics. List any required field
the brief is missing in gaps — ask, don't guess.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_brief exactly once with the structured fields + voiceFlags + gaps. Stop.`,
  tools: ['submit_brief'],
}

export function createBriefAnalystAgent(config: BriefAnalystConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_brief', description: 'Submit the structured brief. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(incomingBrief: string): Promise<BriefAnalysisResult> {
    if (!incomingBrief?.trim()) throw new Error('brief analyst requires a non-empty campaign brief')
    const guideBlock = config.voiceGuide ? `\n\nVOICE GUIDE:\n${fenceUntrustedContent(config.voiceGuide)}` : ''
    emit('analyse', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `INCOMING CAMPAIGN BRIEF:\n${fenceUntrustedContent(incomingBrief)}${guideBlock}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const { gaps, ...brief } = out
    emit('analyse', 'ok', `${gaps.length} gap(s), ${brief.voiceFlags.length} voice flag(s)`)
    return { brief, gaps, requiresReview: true }
  }

  return {
    name: 'marketing-brief-analyst',
    run,
    asHandle() {
      return { name: 'marketing-brief-analyst', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
