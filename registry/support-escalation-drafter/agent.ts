import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import {
  createPIIRedactor,
  DEFAULT_PII_RULES,
  fenceUntrustedContent,
  UNTRUSTED_CONTENT_DIRECTIVE,
  type PIIRule,
} from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Escalation Drafter — turns a ticket + the support agent's notes into a TYPED internal
 * escalation draft (impact / what-we-tried / what-we-need / SLA window). Two safeguards:
 *
 *   1. A DETERMINISTIC PII backstop (`createPIIRedactor`) re-scans every drafted field and
 *      strips raw email / phone / structured ids the model leaked — the draft posts into
 *      an internal channel, so customer PII never rides along by accident.
 *   2. ALWAYS a draft: `requiresAgentReview` is always true — the support agent reviews
 *      before posting.
 *
 * ```ts
 * const { draft } = await createEscalationDrafterAgent({ adapter }).run(ticketAndNotes)
 * ```
 */

export type EscalationNeed =
  | 'engineering-investigation'
  | 'account-manager-call'
  | 'refund-approval'
  | 'other'

export interface EscalationDraft {
  customerImpact: string
  whatWeTried: string
  whatWeNeed: string
  need: EscalationNeed
  suggestedSla: string
}

export interface EscalationResult {
  draft: EscalationDraft
  /** PII the deterministic backstop stripped from the draft (counts by field). */
  piiStripped: number
  /** Always true — a draft for the support agent to review before posting. */
  requiresAgentReview: boolean
}

export interface EscalationDrafterConfig {
  adapter: AdapterFactory
  /** Extra PII rules layered onto DEFAULT_PII_RULES for the backstop. */
  extraRules?: PIIRule[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Draft = z.object({
  customerImpact: z.string(),
  whatWeTried: z.string(),
  whatWeNeed: z.string(),
  need: z.enum(['engineering-investigation', 'account-manager-call', 'refund-approval', 'other']),
  suggestedSla: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'escalation-drafter',
  description: 'Drafts a typed internal escalation message from a ticket + agent notes.',
  systemPrompt: `You draft an INTERNAL escalation message from a support ticket plus the agent's notes.
Fields: customer impact; what we tried; what we need (engineering investigation / account-manager
call / refund approval / other); a suggested SLA window.

Write for an internal audience. Refer to the customer by initials + account id — do NOT copy raw
email addresses or phone numbers into the draft. If the notes are too thin to escalate (no account
id, no product area, no reproduction), say so in customerImpact and set need to "other".

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_draft exactly once with { customerImpact, whatWeTried, whatWeNeed, need, suggestedSla }. Stop.`,
  tools: ['submit_draft'],
}

export function createEscalationDrafterAgent(config: EscalationDrafterConfig) {
  const rules = [...DEFAULT_PII_RULES, ...(config.extraRules ?? [])]
  const backstop = createPIIRedactor({ rules })
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_draft', description: 'Submit the escalation draft. Call exactly once.', schema: Draft, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(input: string): Promise<EscalationResult> {
    if (!input?.trim()) throw new Error('escalation drafter requires a ticket + agent notes')
    emit('draft', 'start')
    const d = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `TICKET + AGENT NOTES:\n${fenceUntrustedContent(input)}`,
      parse: (a) => Draft.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })

    // BACKSTOP: deterministically strip any raw PII the model left in the free-text fields.
    let piiStripped = 0
    const scrub = (text: string): string => {
      const { value, hits } = backstop.redact(text)
      piiStripped += hits.length
      return value
    }
    const draft: EscalationDraft = {
      customerImpact: scrub(d.customerImpact),
      whatWeTried: scrub(d.whatWeTried),
      whatWeNeed: scrub(d.whatWeNeed),
      need: d.need,
      suggestedSla: scrub(d.suggestedSla),
    }
    emit('draft', 'ok', piiStripped ? `${piiStripped} PII stripped` : d.need)
    return { draft, piiStripped, requiresAgentReview: true }
  }

  return {
    name: 'support-escalation-drafter',
    run,
    asHandle() {
      return { name: 'support-escalation-drafter', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
