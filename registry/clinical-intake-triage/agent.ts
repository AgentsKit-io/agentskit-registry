import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Intake Triage — classifies an inbound patient message by urgency and routes it.
 * Typed output (not free text), with a code-enforced safety net: a deterministic
 * red-flag scan can only ESCALATE urgency, never let the model downgrade an emergency.
 *
 *   1. Model classifies → typed { urgency, rationale, queue } (`invokeStructured` + zod).
 *   2. DETERMINISTIC red-flag scan — if the raw message matches an emergency pattern
 *      (chest pain, stroke signs, suicidal ideation, severe bleeding, …) the urgency
 *      is forced to `emergency` regardless of what the model said. The model can make
 *      triage MORE urgent, never less.
 *   3. `unclear` (or emergency) → `requiresHumanTriage` — escalate to a nurse, never guess.
 *
 * ```ts
 * const r = await createIntakeTriageAgent({ adapter }).run('I have crushing chest pain')
 * // → urgency 'emergency', requiresHumanTriage true, redFlagsHit ['chest pain']
 * ```
 */

export type Urgency = 'emergency' | 'urgent' | 'routine' | 'administrative' | 'unclear'

export interface TriageResult {
  urgency: Urgency
  rationale: string
  queue: string
  /** Red-flag patterns that matched the raw message (forced emergency). */
  redFlagsHit: string[]
  requiresHumanTriage: boolean
}

export interface IntakeTriageConfig {
  adapter: AdapterFactory
  /** Emergency red-flag patterns. A match forces `emergency`. Defaults below. */
  redFlags?: RegExp[]
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const DEFAULT_RED_FLAGS: RegExp[] = [
  /\bchest pain\b/i,
  /\b(can'?t|cannot|trouble|difficulty) breath/i,
  /\bstroke\b|\bface droop|\bslurred speech\b/i,
  /\b(severe|heavy|uncontrolled) bleeding\b/i,
  /\bsuicid|\bkill myself\b|\bend my life\b|\bself.?harm\b/i,
  /\bunconscious\b|\bnot breathing\b|\boverdose\b|\banaphyla/i,
]

const Classification = z.object({
  urgency: z.enum(['emergency', 'urgent', 'routine', 'administrative', 'unclear']),
  rationale: z.string(),
  queue: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const triageSkill = {
  name: 'intake-triage',
  description: 'Classifies an inbound patient message by urgency and suggests a routing queue.',
  systemPrompt: `You triage inbound patient messages for a healthcare practice. Classify each as:
emergency | urgent | routine | administrative | unclear.

NEVER give clinical advice. If the message suggests an emergency (chest pain, stroke signs,
severe bleeding, suicidal ideation, trouble breathing), classify "emergency". When you cannot
confidently classify, use "unclear" — a human triage nurse decides; never guess.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_triage exactly once with { urgency, rationale (one sentence), queue (suggested next
queue) }. Output nothing else.`,
  tools: ['submit_triage'],
}

const sev = (u: Urgency): number => ['emergency', 'urgent', 'routine', 'administrative', 'unclear'].indexOf(u)

export function createIntakeTriageAgent(config: IntakeTriageConfig) {
  const redFlags = config.redFlags ?? DEFAULT_RED_FLAGS

  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  const submit = (): ToolDefinition =>
    defineZodTool({
      name: 'submit_triage',
      description: 'Submit the triage classification. Call exactly once.',
      schema: Classification,
      toJsonSchema: toJson,
      async execute() {
        return 'recorded'
      },
    }) as ToolDefinition

  async function run(message: string): Promise<TriageResult> {
    if (!message?.trim()) throw new Error('intake triage requires a non-empty message')

    // Deterministic red-flag scan FIRST — independent of the model.
    const redFlagsHit = redFlags.map((re) => message.match(re)?.[0]).filter((m): m is string => Boolean(m))

    emit('classify', 'start')
    let cls: z.infer<typeof Classification>
    try {
      cls = await invokeStructured({
        adapter: config.adapter,
        tool: submit(),
        task: `PATIENT MESSAGE:\n${fenceUntrustedContent(message)}`,
        parse: (a) => Classification.parse(a),
        skill: triageSkill,
        memory: config.memory,
        observers: config.observers,
        onConfirm: config.onConfirm,
        maxSteps: config.maxSteps ?? 3,
      })
    } catch {
      // Fail safe — an unclassifiable run goes to a human, never silently dropped.
      cls = { urgency: 'unclear', rationale: 'classification unavailable — failed safe to human triage', queue: 'nurse-triage' }
    }

    // SAFETY NET: a red flag forces emergency; the model can only make triage stricter.
    let urgency = cls.urgency
    let rationale = cls.rationale
    if (redFlagsHit.length && sev(urgency) > sev('emergency')) {
      urgency = 'emergency'
      rationale = `red-flag term(s) detected (${redFlagsHit.join(', ')}) — forced emergency. Model said: ${cls.rationale}`
    }
    emit('classify', 'ok', `${urgency}${redFlagsHit.length ? ` (red-flag)` : ''}`)

    return {
      urgency,
      rationale,
      queue: urgency === 'emergency' ? 'EMERGENCY-911' : cls.queue,
      redFlagsHit,
      requiresHumanTriage: urgency === 'emergency' || urgency === 'unclear',
    }
  }

  return {
    name: 'clinical-intake-triage',
    run,
    /** AgentHandle: accepts the raw message, returns a JSON TriageResult. */
    asHandle() {
      return {
        name: 'clinical-intake-triage',
        run: async (task: string) => JSON.stringify(await run(task)),
      }
    },
  }
}
