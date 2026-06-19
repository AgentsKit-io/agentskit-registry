import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Referral Router — reads a referral packet and routes it to the receiving specialty +
 * urgency. Typed output (not free text); incomplete packets are NOT assigned — the
 * missing fields are surfaced and the case escalates to a human coordinator.
 *
 *   1. Model routes → typed { specialty, urgency, rationale, missingFields } (`invokeStructured` + zod).
 *   2. Code rule: any `missingFields`, an `unclear` specialty, or a failed run →
 *      `requiresHumanReview` and NO auto-assignment. The model never assigns a
 *      half-complete packet; it flags the gap.
 *
 * ```ts
 * const r = await createReferralRouterAgent({ adapter }).run(referralPacketText)
 * if (r.requiresHumanReview) routeToCoordinator(r)
 * ```
 */

export type ReferralUrgency = 'routine' | 'soon' | 'urgent' | 'unclear'

export interface ReferralResult {
  specialty: string
  urgency: ReferralUrgency
  rationale: string
  /** Critical fields absent from the packet (reason, meds, prior workup). */
  missingFields: string[]
  requiresHumanReview: boolean
}

export interface ReferralRouterConfig {
  adapter: AdapterFactory
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Routing = z.object({
  specialty: z.string(),
  urgency: z.enum(['routine', 'soon', 'urgent', 'unclear']),
  rationale: z.string(),
  missingFields: z.array(z.string()).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const routerSkill = {
  name: 'referral-router',
  description: 'Routes a referral packet to the receiving specialty and urgency.',
  systemPrompt: `You route inbound referral packets. Identify the receiving specialty (e.g. cardiology,
orthopedics, oncology) and urgency (routine | soon | urgent). Cite the relevant clinical finding
in a one-sentence rationale.

If the packet is missing critical info (reason for referral, current medications, prior workup),
list those in missingFields rather than assigning — do NOT route an incomplete packet. Use
specialty "unclear" and urgency "unclear" when you cannot determine routing. Never make clinical
determinations beyond routing.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_routing exactly once with { specialty, urgency, rationale, missingFields }. Stop.`,
  tools: ['submit_routing'],
}

export function createReferralRouterAgent(config: ReferralRouterConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_routing',
      description: 'Submit the referral routing. Call exactly once.',
      schema: Routing,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  async function run(packet: string): Promise<ReferralResult> {
    if (!packet?.trim()) throw new Error('referral router requires a non-empty packet')

    emit('route', 'start')
    let r: z.infer<typeof Routing>
    try {
      r = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `REFERRAL PACKET:\n${fenceUntrustedContent(packet)}`,
        parse: (a) => Routing.parse(a),
        skill: routerSkill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      r = { specialty: 'unclear', urgency: 'unclear', rationale: 'routing unavailable — failed safe to human coordinator', missingFields: [] }
    }

    const requiresHumanReview = r.missingFields.length > 0 || r.specialty.toLowerCase() === 'unclear' || r.urgency === 'unclear'
    emit('route', 'ok', requiresHumanReview ? 'human review' : `${r.specialty} / ${r.urgency}`)
    return { ...r, requiresHumanReview }
  }

  return {
    name: 'clinical-referral-router',
    run,
    asHandle() {
      return {
        name: 'clinical-referral-router',
        run: async (task: string) => JSON.stringify(await run(task)),
      }
    },
  }
}
