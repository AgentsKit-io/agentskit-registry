import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { createPIIRedactor, DEFAULT_PII_RULES, fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE, type PIIRule } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Chart Redactor — strips HIPAA identifiers from a clinical chart before it leaves the
 * tenant boundary. The "no identifier survives" guarantee is enforced in CODE, not the
 * prompt:
 *
 *   1. The model does the bulk redaction (incl. names, free-text) → typed { redacted, log }.
 *   2. A DETERMINISTIC backstop (`createPIIRedactor`, from `@agentskit/core/security`)
 *      re-scans the model's output and redacts any structured identifier it missed
 *      (email, phone, SSN, MRN/DOB via your `extraRules`, …). The emitted chart is
 *      therefore ALWAYS clean of those patterns regardless of what the model did.
 *   3. Anything the backstop catches is flagged — a model that under-redacts can only
 *      be corrected, never trusted to have finished the job.
 *
 * Pass HIPAA-specific patterns (MRN format, known patient names) via `extraRules`.
 *
 * ```ts
 * const agent = createChartRedactorAgent({
 *   adapter,
 *   extraRules: [{ name: 'mrn', pattern: /\bMRN[-:\s]?\d{6,}\b/gi, replacer: '[REDACTED_MRN]' }],
 * })
 * const { redacted, status } = await agent.run(chartText)
 * ```
 */

export interface RedactionLogEntry {
  type: string
  location: string
  rationale: string
  /** True when the deterministic backstop caught this (the model missed it). */
  backstop?: boolean
}

export interface RedactionResult {
  redacted: string
  log: RedactionLogEntry[]
  /** 'clean' when the model's output already passed the backstop; else 'backstop-applied'. */
  status: 'clean' | 'backstop-applied'
}

export interface ChartRedactorConfig {
  adapter: AdapterFactory
  /** Extra deterministic PII patterns (MRN, known names, institution-specific ids). */
  extraRules?: PIIRule[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Redaction = z.object({
  redacted: z.string(),
  log: z.array(z.object({ type: z.string(), location: z.string(), rationale: z.string() })),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const redactorSkill = {
  name: 'chart-redactor',
  description: 'Redacts HIPAA identifiers from a clinical chart, preserving clinical content.',
  systemPrompt: `You redact a clinical chart before it leaves the tenant boundary. Redact every HIPAA
identifier — patient/family names, MRN, exact DOB and admission dates, contact info, biometric
identifiers, full-face photo references, and any free-text containing the same. Replace each with
a bracketed tag like [REDACTED_NAME], [REDACTED_MRN], [REDACTED_DOB].

NEVER alter clinical findings or medication lists — redact identifiers ONLY.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_redaction exactly once with { redacted, log }. The log lists each redaction
{ type, location, rationale }. Output nothing else.`,
  tools: ['submit_redaction'],
}

export function createChartRedactorAgent(config: ChartRedactorConfig) {
  const rules = [...DEFAULT_PII_RULES, ...(config.extraRules ?? [])]
  const backstop = createPIIRedactor({ rules })

  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_redaction',
      description: 'Submit the redacted chart + log. Call exactly once.',
      schema: Redaction,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  async function run(chart: string): Promise<RedactionResult> {
    if (!chart?.trim()) throw new Error('chart redactor requires non-empty chart text')

    emit('redact', 'start')
    const sub = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `CHART TO REDACT:\n${fenceUntrustedContent(chart)}`,
      parse: (a) => Redaction.parse(a),
      skill: redactorSkill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('redact', 'ok', `${sub.log.length} model redaction(s)`)

    // Deterministic backstop — the emitted chart NEVER contains a structured identifier
    // the rules cover, no matter what the model did.
    emit('backstop', 'start')
    const { value: redacted, hits } = backstop.redact(sub.redacted)
    const backstopLog: RedactionLogEntry[] = hits.map((h) => ({
      type: h.rule,
      location: `${h.count} occurrence(s)`,
      rationale: 'caught by deterministic PII backstop — the model left it in',
      backstop: true,
    }))
    emit('backstop', hits.length ? 'error' : 'ok', hits.length ? `caught ${hits.length} missed pattern(s)` : 'clean')

    return {
      redacted,
      log: [...sub.log, ...backstopLog],
      status: hits.length ? 'backstop-applied' : 'clean',
    }
  }

  return {
    name: 'clinical-chart-redactor',
    run,
    /** AgentHandle: accepts raw chart text, returns the redacted chart. */
    asHandle() {
      return {
        name: 'clinical-chart-redactor',
        run: async (task: string) => (await run(task)).redacted,
      }
    },
  }
}
