import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Schedule Planner — drafts a TYPED multi-channel publish schedule from approved drafts +
 * channel constraints. It FLAGS conflicts (two assets in one window, embargo collisions)
 * instead of silently dropping items, and never schedules publish jobs itself — the plan
 * is for the account lead to confirm (`requiresApproval` always true).
 *
 * ```ts
 * const { schedule, conflicts } = await createSchedulePlannerAgent({ adapter }).run(input)
 * ```
 */

export interface ScheduleEntry {
  date: string
  channel: string
  assetId: string
  /** Why this slot — best-time window, cadence. */
  rationale: string
}

export interface ScheduleConflict {
  /** 'window' (two assets same slot) | 'embargo' | 'frequency-cap'. */
  type: string
  assetIds: string[]
  detail: string
}

export interface ScheduleResult {
  schedule: ScheduleEntry[]
  conflicts: ScheduleConflict[]
  /** Always true — the plan is for the account lead to confirm before any post goes out. */
  requiresApproval: boolean
}

export interface SchedulePlannerConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Output = z.object({
  schedule: z.array(z.object({
    date: z.string(),
    channel: z.string(),
    assetId: z.string(),
    rationale: z.string(),
  })),
  conflicts: z.array(z.object({
    type: z.string(),
    assetIds: z.array(z.string()),
    detail: z.string(),
  })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'schedule-planner',
  description: 'Drafts a typed multi-channel publish schedule, flagging conflicts (never schedules itself).',
  systemPrompt: `You draft a multi-channel publish schedule from approved drafts plus channel constraints
(best-time windows, frequency caps, embargoes). Each entry: date, channel, asset id, cadence rationale.

FLAG conflicts — two assets in the same window, embargo collisions, frequency-cap breaches — in the
conflicts array instead of silently dropping items. NEVER schedule publish jobs yourself; this is a
plan for the account lead to confirm before anything goes out.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_schedule exactly once with { schedule, conflicts }. Stop.`,
  tools: ['submit_schedule'],
}

export function createSchedulePlannerAgent(config: SchedulePlannerConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_schedule', description: 'Submit the publish schedule. Call exactly once.', schema: Output, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<ScheduleResult> {
    if (!input?.trim()) throw new Error('schedule planner requires approved drafts + channel constraints')
    emit('plan', 'start')
    const out = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `APPROVED DRAFTS + CHANNEL CONSTRAINTS:\n${fenceUntrustedContent(input)}`,
      parse: (a) => Output.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('plan', 'ok', `${out.schedule.length} slot(s), ${out.conflicts.length} conflict(s)`)
    return { schedule: out.schedule, conflicts: out.conflicts, requiresApproval: true }
  }

  return {
    name: 'agency-schedule-planner',
    run,
    asHandle() {
      return { name: 'agency-schedule-planner', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
