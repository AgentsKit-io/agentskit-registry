import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Social Publisher — formats one approved copy variant for each target platform and
 * DELIVERS it through caller-injected transports. The model only formats; delivery is
 * deterministic code that calls your transport and reports the real provider id — it
 * never claims a post it didn't make.
 *
 * Two hard guarantees the previous version lacked:
 *   1. **Real delivery or honest failure** — a platform with no transport is reported
 *      `ok:false, error:'no transport configured'`, never a faked `sent:true`.
 *   2. **Fail-closed HITL** — every send is gated by `approve`. With no `approve` and
 *      `autoApprove` off (the default), nothing is sent: you get the formatted drafts
 *      and `requiresApproval:true`. You must opt in to actually blast.
 *
 * ```ts
 * const r = await createSocialPublisherAgent({
 *   adapter,
 *   transports: { slack: { send: (m) => slack.post(channel, m), maxChars: 3000 } },
 *   approve: (platform, msg) => ui.confirm(`Post to ${platform}?`, msg),
 * }).run(approvedCopy)
 * ```
 */

export interface Transport {
  /** Deliver a fully-formatted message; return the provider's message id/timestamp. */
  send: (message: string) => Promise<{ ts: string }> | { ts: string }
  /** Platform character limit — messages over it are rejected before send. */
  maxChars?: number
}

export type Transports = Record<string, Transport>

export interface Delivery {
  platform: string
  ok: boolean
  ts?: string
  /** Set when ok:false — 'no transport configured' | 'too long' | 'not approved' | raw send error. */
  error?: string
  skipped?: boolean
}

export interface PublishResult {
  /** The platform-specific formatted message the model produced. */
  formatted: Record<string, string>
  delivery: Delivery[]
  /** True when at least one platform was held back pending approval. */
  requiresApproval: boolean
}

export interface SocialPublisherConfig {
  adapter: AdapterFactory
  /** Per-platform delivery transports. Only these platforms can be posted to. */
  transports?: Transports
  /** HITL gate, called per platform before sending. Return false to hold back. */
  approve?: (platform: string, message: string) => boolean | Promise<boolean>
  /** Send without an `approve` gate. Default false (fail-closed). */
  autoApprove?: boolean
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

export function createSocialPublisherAgent(config: SocialPublisherConfig) {
  const transports = config.transports ?? {}
  const platforms = Object.keys(transports)
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }

  // The format schema advertises exactly the platforms that have a transport.
  const Formatted = z.object(
    Object.fromEntries(platforms.map((p) => [p, z.string()])) as Record<string, z.ZodString>,
  )
  const skill = {
    name: 'social-publisher',
    description: 'Formats one approved copy variant per target platform (delivery is gated, deterministic code).',
    systemPrompt: `You format ONE approved marketing copy variant for delivery. You run only after a human
approved the copy. You NEVER modify the message intent — you only adapt formatting per platform:
- Discord: Discord markdown (**bold**, *italic*, \`code\`); under 2000 chars; CTA as a plain URL.
- Slack: Slack mrkdwn (*bold*, _italic_); under 3000 chars; lead with the headline.

Target platforms: ${platforms.length ? platforms.join(', ') : '(none — produce nothing)'}.
You do NOT send anything — delivery is handled outside you. Just return the formatted text per platform.

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_formatted exactly once with a string for each target platform. Stop.`,
    tools: ['submit_formatted'],
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_formatted', description: 'Submit the formatted message per platform. Call exactly once.', schema: Formatted, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(approvedCopy: string): Promise<PublishResult> {
    if (!approvedCopy?.trim()) throw new Error('social publisher requires the approved copy variant')
    if (platforms.length === 0) {
      // No transport wired — refuse to pretend. Caller gets nothing delivered, plainly.
      return { formatted: {}, delivery: [], requiresApproval: false }
    }

    emit('format', 'start', platforms.join(','))
    const formatted = (await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `APPROVED COPY:\n${fenceUntrustedContent(approvedCopy)}`,
      parse: (a) => Formatted.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })) as Record<string, string>
    emit('format', 'ok')

    const delivery: Delivery[] = []
    let requiresApproval = false
    for (const platform of platforms) {
      const message = formatted[platform]
      const transport = transports[platform]
      if (!message) {
        delivery.push({ platform, ok: false, error: 'no formatted message produced' })
        continue
      }
      if (transport.maxChars && message.length > transport.maxChars) {
        delivery.push({ platform, ok: false, error: `too long (${message.length} > ${transport.maxChars})` })
        continue
      }
      // FAIL-CLOSED HITL: send only with explicit approval (or autoApprove opt-in).
      const approved = config.approve
        ? await config.approve(platform, message)
        : config.autoApprove === true
      if (!approved) {
        requiresApproval = true
        delivery.push({ platform, ok: false, skipped: true, error: 'not approved' })
        emit('send', 'skip', platform)
        continue
      }
      try {
        emit('send', 'start', platform)
        const { ts } = await transport.send(message)
        delivery.push({ platform, ok: true, ts })
        emit('send', 'ok', platform)
      } catch (err) {
        // Report the real error; do not retry automatically.
        delivery.push({ platform, ok: false, error: err instanceof Error ? err.message : String(err) })
        emit('send', 'error', platform)
      }
    }
    return { formatted, delivery, requiresApproval }
  }

  return {
    name: 'marketing-social-publisher',
    run,
    asHandle() {
      return { name: 'marketing-social-publisher', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
