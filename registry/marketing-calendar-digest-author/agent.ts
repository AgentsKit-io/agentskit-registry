import type { AdapterFactory, ChatMemory, Observer, ToolCall, ToolDefinition } from '@agentskit/core'
import { fenceUntrustedContent, UNTRUSTED_CONTENT_DIRECTIVE } from '@agentskit/core/security'
import { invokeStructured } from '@agentskit/runtime'
import { defineZodTool } from '@agentskit/tools'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import type { JSONSchema7 } from 'json-schema'

/**
 * Calendar Digest Author — turns the week's scheduled social posts into a TYPED digest
 * (per-channel groups + a ready-to-paste Slack markdown block). Delivery is optional and
 * HITL-gated: pass a `transport` to actually post it, and the digest is reported as
 * delivered only when the transport really returned an id — it never fakes a post.
 *
 * The digest text is the product; delivery is a bonus. With no transport you still get
 * `{ digest, markdown }` to render yourself.
 *
 * ```ts
 * const r = await createCalendarDigestAuthorAgent({ adapter }).run(scheduledPosts)
 * // r.markdown → paste into Slack, or pass `transport` to auto-deliver (gated).
 * ```
 */

export interface DigestPost {
  date: string
  headline: string
  persona: string
}
export interface ChannelGroup {
  channel: string
  posts: DigestPost[]
}
export interface CalendarDigest {
  weekOf: string
  channels: ChannelGroup[]
  totalPosts: number
}

export interface Transport {
  send: (message: string) => Promise<{ ts: string }> | { ts: string }
  maxChars?: number
}

export interface DigestDelivery {
  ok: boolean
  ts?: string
  error?: string
  skipped?: boolean
}

export interface DigestResult {
  digest: CalendarDigest
  /** Slack-mrkdwn rendering of the digest, ready to post. */
  markdown: string
  /** Present only when a transport was configured. */
  delivery?: DigestDelivery
}

export interface CalendarDigestAuthorConfig {
  adapter: AdapterFactory
  /** Optional delivery transport (e.g. Slack). Omit to just get the digest text. */
  transport?: Transport
  /** HITL gate before sending. Return false to hold back. */
  approve?: (markdown: string) => boolean | Promise<boolean>
  /** Send without an `approve` gate. Default false (fail-closed). */
  autoApprove?: boolean
  memory?: ChatMemory
  observers?: Observer[]
  onConfirm?: (toolCall: ToolCall) => boolean | Promise<boolean>
  maxSteps?: number
}

const Digest = z.object({
  weekOf: z.string(),
  channels: z.array(z.object({
    channel: z.string(),
    posts: z.array(z.object({ date: z.string(), headline: z.string(), persona: z.string() })),
  })),
  totalPosts: z.number().int().min(0),
  markdown: z.string(),
})
const toJson = (s: z.ZodTypeAny): JSONSchema7 => zodToJsonSchema(s) as JSONSchema7

const skill = {
  name: 'calendar-digest-author',
  description: 'Produces a typed weekly social-calendar digest + a Slack-ready markdown block.',
  systemPrompt: `You produce a weekly social-calendar digest from a list of scheduled posts.
Group posts by channel; for each post give date, headline, target persona. Then render a Slack
mrkdwn block: a "Social Calendar — Week of <weekOf>" header, per-channel sections (one scannable
line per post, no body copy), and a total count. If no posts are scheduled, set channels=[],
totalPosts=0, and markdown="No posts scheduled this week."

${UNTRUSTED_CONTENT_DIRECTIVE}

Call submit_digest exactly once with { weekOf, channels, totalPosts, markdown }. You do NOT send
anything — delivery is handled outside you. Stop.`,
  tools: ['submit_digest'],
}

export function createCalendarDigestAuthorAgent(config: CalendarDigestAuthorConfig) {
  const emit = (label: string, status: 'start' | 'ok' | 'skip' | 'error', detail?: string) => {
    for (const o of config.observers ?? []) void o.on({ type: 'progress', label, status, detail })
  }
  const submit = (): ToolDefinition =>
    defineZodTool({ name: 'submit_digest', description: 'Submit the weekly digest. Call exactly once.', schema: Digest, toJsonSchema: toJson, async execute() { return 'recorded' } }) as ToolDefinition

  async function run(scheduledPosts: string): Promise<DigestResult> {
    if (!scheduledPosts?.trim()) throw new Error('calendar digest author requires the scheduled-posts list')
    emit('digest', 'start')
    const d = await invokeStructured({
      adapter: config.adapter,
      tool: submit(),
      task: `SCHEDULED POSTS:\n${fenceUntrustedContent(scheduledPosts)}`,
      parse: (a) => Digest.parse(a),
      skill,
      memory: config.memory,
      observers: config.observers,
      onConfirm: config.onConfirm,
      maxSteps: config.maxSteps ?? 3,
    })
    const { markdown, ...digest } = d
    emit('digest', 'ok', `${digest.totalPosts} post(s)`)

    let delivery: DigestDelivery | undefined
    if (config.transport) {
      if (config.transport.maxChars && markdown.length > config.transport.maxChars) {
        delivery = { ok: false, error: `too long (${markdown.length} > ${config.transport.maxChars})` }
      } else {
        const approved = config.approve ? await config.approve(markdown) : config.autoApprove === true
        if (!approved) {
          delivery = { ok: false, skipped: true, error: 'not approved' }
          emit('send', 'skip')
        } else {
          try {
            emit('send', 'start')
            const { ts } = await config.transport.send(markdown)
            delivery = { ok: true, ts }
            emit('send', 'ok')
          } catch (err) {
            delivery = { ok: false, error: err instanceof Error ? err.message : String(err) }
            emit('send', 'error')
          }
        }
      }
    }
    return { digest, markdown, delivery }
  }

  return {
    name: 'marketing-calendar-digest-author',
    run,
    asHandle() {
      return { name: 'marketing-calendar-digest-author', run: async (task: string) => JSON.stringify(await run(task)) }
    },
  }
}
