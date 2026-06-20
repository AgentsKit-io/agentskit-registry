import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { createPIIRedactor, DEFAULT_PII_RULES, fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE, type PIIRule } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Redaction Bot — redacts PII from a legal document before it leaves the matter, with
 * the "no identifier survives" guarantee enforced in CODE (not the prompt), plus a
 * privilege-flagging step that never silently redacts privileged content.
 *
 *   1. Model redaction → typed { redacted, log, privilegeFlags }.
 *   2. DETERMINISTIC backstop (`createPIIRedactor`) re-scans the model's output and
 *      strips any structured identifier it missed (SSN/email/phone/… + caller
 *      `extraRules` for gov-IDs / account numbers). Output is always clean of those.
 *   3. `privilegeFlags` surface spans the supervising attorney must decide on — they
 *      are NOT auto-redacted (silent redaction of privilege loses it / misleads review).
 *
 * ```ts
 * const agent = createRedactionBotAgent({
 *   adapter,
 *   extraRules: [{ name: 'acct', pattern: /\b\d{8,17}\b/g, replacer: '[REDACTED_ACCT]' }],
 * })
 * const { redacted, privilegeFlags } = await agent.run(documentText)
 * ```
 */

export interface RedactionLogEntry {
  category: string
  span: string
  rationale: string
  backstop?: boolean
}

export interface PrivilegeFlag {
  span: string
  basis: string
}

export interface LegalRedactionResult {
  redacted: string
  log: RedactionLogEntry[]
  /** Privileged spans for attorney review — surfaced, never auto-redacted. */
  privilegeFlags: PrivilegeFlag[]
  status: 'clean' | 'backstop-applied'
}

export interface RedactionBotConfig {
  adapter: AdapterFactory
  /** Extra deterministic PII patterns (gov-IDs, account numbers, matter-specific ids). */
  extraRules?: PIIRule[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Redaction = z.object({
  redacted: z.string(),
  log: z.array(z.object({ category: z.string(), span: z.string(), rationale: z.string() })),
  privilegeFlags: z.array(z.object({ span: z.string(), basis: z.string() })).default([]),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const redactorSkill = {
  name: 'legal-redaction-bot',
  description: 'Redacts PII from a legal document and flags privileged content for attorney review.',
  systemPrompt: `You redact a legal document before it leaves the matter. Redact PII per the legal-strict
profile: non-party personal names, government IDs, financial account numbers, medical record
numbers, exact DOBs, street addresses. Replace each with a bracketed tag, e.g. [REDACTED_NAME].

NEVER silently redact privileged content — instead add it to privilegeFlags so the supervising
attorney decides. Do not redact non-PII substance.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_redaction exactly once with { redacted, log, privilegeFlags }. Output nothing else.`,
  tools: ['submit_redaction'],
}

export function createRedactionBotAgent(config: RedactionBotConfig) {
  const rules = [...DEFAULT_PII_RULES, ...(config.extraRules ?? [])]
  const backstop = createPIIRedactor({ rules })

  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_redaction',
      description: 'Submit the redacted document + log + privilege flags. Call exactly once.',
      schema: Redaction,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  async function run(document: string): Promise<LegalRedactionResult> {
    if (!document?.trim()) throw new Error('redaction bot requires non-empty document text')

    emit('redact', 'start')
    const sub = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `DOCUMENT TO REDACT:\n${fenceUntrustedContent(document)}`,
      parse: (a) => Redaction.parse(a),
      skill: redactorSkill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    emit('redact', 'ok', `${sub.log.length} redaction(s), ${sub.privilegeFlags.length} privilege flag(s)`)

    emit('backstop', 'start')
    const { value: redacted, hits } = backstop.redact(sub.redacted)
    const backstopLog: RedactionLogEntry[] = hits.map((h) => ({
      category: h.rule,
      span: `${h.count} occurrence(s)`,
      rationale: 'caught by deterministic PII backstop — the model left it in',
      backstop: true,
    }))
    emit('backstop', hits.length ? 'error' : 'ok', hits.length ? `caught ${hits.length} missed pattern(s)` : 'clean')

    return {
      redacted,
      log: [...sub.log, ...backstopLog],
      privilegeFlags: sub.privilegeFlags,
      status: hits.length ? 'backstop-applied' : 'clean',
    }
  }

  return {
    name: 'legal-redaction-bot',
    run,
    /** AgentHandle: accepts raw document text, returns the redacted document. */
    asHandle() {
      return {
        name: 'legal-redaction-bot',
        run: async (task: string) => (await run(task)).redacted,
      }
    },
  }
}
