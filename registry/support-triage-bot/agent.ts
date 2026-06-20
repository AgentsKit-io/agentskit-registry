import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Triage Bot — classifies a support ticket by topic / severity (P1–P4) / queue. Typed
 * output, with a deterministic red-flag net: outage / data-loss / security-breach
 * language forces P1 regardless of the model (it can only raise severity, never bury
 * a P1). Output is metadata for a human agent — the bot never replies to the customer.
 */

export type Severity = 'P1' | 'P2' | 'P3' | 'P4'

export interface TriageResult {
  topic: string
  severity: Severity
  queue: string
  rationale: string
  redFlagsHit: string[]
}

export interface TriageBotConfig {
  adapter: AdapterFactory
  /** Patterns that force P1. Defaults: outage/data-loss/security/breach. */
  p1RedFlags?: RegExp[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const DEFAULT_P1: RegExp[] = [
  /\b(outage|down|offline|not working for all)\b/i,
  /\bdata (loss|breach|leak|deleted)\b/i,
  /\b(security|breach|hacked|compromised|unauthor[iz]?ed access)\b/i,
  /\bcannot (access|log ?in).*(everyone|all users|whole team)\b/i,
]

const Classification = z.object({
  topic: z.string(),
  severity: z.enum(['P1', 'P2', 'P3', 'P4']),
  queue: z.string(),
  rationale: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'support-triage-bot',
  description: 'Classifies a support ticket by topic, severity (P1-P4), and queue.',
  systemPrompt: `You triage inbound support tickets. Classify topic, severity (P1|P2|P3|P4), and the
suggested queue. P1 ONLY for outage, data loss, security incident, or contractual breach. Default
to P3 when unsure. You NEVER reply to the customer — your output is metadata for a human agent.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_triage exactly once with { topic, severity, queue, rationale }. Stop.`,
  tools: ['submit_triage'],
}

const rank = (s: Severity): number => ['P1', 'P2', 'P3', 'P4'].indexOf(s)

export function createTriageBotAgent(config: TriageBotConfig) {
  const p1Flags = config.p1RedFlags ?? DEFAULT_P1
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_triage', description: 'Submit the triage classification. Call exactly once.', schema: Classification, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(ticket: string): Promise<TriageResult> {
    if (!ticket?.trim()) throw new Error('triage bot requires a non-empty ticket')
    const redFlagsHit = p1Flags.map((re) => ticket.match(re)?.[0]).filter((m): m is string => Boolean(m))

    emit('triage', 'start')
    let c: z.infer<typeof Classification>
    try {
      c = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `SUPPORT TICKET:\n${fenceUntrustedContent(ticket)}`,
        parse: (a) => Classification.parse(a),
        skill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      c = { topic: 'unknown', severity: 'P3', queue: 'general', rationale: 'classification unavailable — defaulted to P3' }
    }

    // SAFETY NET: a red flag forces P1; the model can only raise severity, never bury a P1.
    let severity = c.severity
    let rationale = c.rationale
    if (redFlagsHit.length && rank(severity) > rank('P1')) {
      severity = 'P1'
      rationale = `red-flag term(s) (${redFlagsHit.join(', ')}) — forced P1. Model said: ${c.rationale}`
    }
    emit('triage', 'ok', `${severity}${redFlagsHit.length ? ' (red-flag)' : ''}`)
    return { topic: c.topic, severity, queue: severity === 'P1' ? 'incident' : c.queue, rationale, redFlagsHit }
  }

  return {
    name: 'support-triage-bot',
    run,
    asHandle() {
      return { name: 'support-triage-bot', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
