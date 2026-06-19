import { describe, it, expect, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCalendarDigestAuthorAgent } from './agent'

const DIGEST = {
  weekOf: '2026-06-22',
  channels: [{ channel: 'Slack', posts: [{ date: 'Mon', headline: 'Launch', persona: 'devs' }] }],
  totalPosts: 1,
  markdown: '*Social Calendar — Week of 2026-06-22*\n• Mon — Launch (devs)',
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_digest', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-calendar-digest-author', () => {
  it('produces a typed digest + markdown, no delivery without a transport', async () => {
    const r = await createCalendarDigestAuthorAgent({ adapter: model(DIGEST) }).run('scheduled posts')
    expect(r.digest.totalPosts).toBe(1)
    expect(r.digest.channels[0].channel).toBe('Slack')
    expect(r.markdown).toMatch(/Week of 2026-06-22/)
    expect(r.delivery).toBeUndefined()
  })

  it('delivers via transport when approved', async () => {
    const send = vi.fn(async () => ({ ts: 'abc' }))
    const r = await createCalendarDigestAuthorAgent({ adapter: model(DIGEST), transport: { send }, autoApprove: true }).run('posts')
    expect(send).toHaveBeenCalledOnce()
    expect(r.delivery).toEqual({ ok: true, ts: 'abc' })
  })

  it('is fail-closed when a transport is set but not approved', async () => {
    const send = vi.fn(async () => ({ ts: 'abc' }))
    const r = await createCalendarDigestAuthorAgent({ adapter: model(DIGEST), transport: { send } }).run('posts')
    expect(send).not.toHaveBeenCalled()
    expect(r.delivery).toMatchObject({ ok: false, skipped: true })
  })

  it('refuses empty input', async () => {
    await expect(createCalendarDigestAuthorAgent({ adapter: model(DIGEST) }).run('  ')).rejects.toThrow(/scheduled-posts/)
  })
})
