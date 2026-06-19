import { describe, it, expect, vi } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSocialPublisherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_formatted', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-social-publisher', () => {
  it('delivers through the transport and reports the real provider id when approved', async () => {
    const send = vi.fn(async () => ({ ts: '1700000000.0001' }))
    const r = await createSocialPublisherAgent({
      adapter: model({ slack: '*Headline* body' }),
      transports: { slack: { send, maxChars: 3000 } },
      autoApprove: true,
    }).run('approved copy')
    expect(send).toHaveBeenCalledOnce()
    expect(r.delivery).toEqual([{ platform: 'slack', ok: true, ts: '1700000000.0001' }])
    expect(r.requiresApproval).toBe(false)
  })

  it('is fail-closed: no approve + autoApprove off holds the send back', async () => {
    const send = vi.fn(async () => ({ ts: 'x' }))
    const r = await createSocialPublisherAgent({
      adapter: model({ slack: 'hi' }),
      transports: { slack: { send } },
    }).run('approved copy')
    expect(send).not.toHaveBeenCalled()
    expect(r.requiresApproval).toBe(true)
    expect(r.delivery[0]).toMatchObject({ platform: 'slack', ok: false, skipped: true })
    expect(r.formatted.slack).toBe('hi') // draft still returned
  })

  it('never fakes delivery for a platform with no transport', async () => {
    const r = await createSocialPublisherAgent({ adapter: model({}) }).run('approved copy')
    expect(r.formatted).toEqual({})
    expect(r.delivery).toEqual([])
  })

  it('rejects an over-limit message before sending', async () => {
    const send = vi.fn(async () => ({ ts: 'x' }))
    const r = await createSocialPublisherAgent({
      adapter: model({ discord: 'x'.repeat(50) }),
      transports: { discord: { send, maxChars: 10 } },
      autoApprove: true,
    }).run('approved copy')
    expect(send).not.toHaveBeenCalled()
    expect(r.delivery[0]).toMatchObject({ platform: 'discord', ok: false })
    expect(r.delivery[0].error).toMatch(/too long/)
  })

  it('refuses empty copy', async () => {
    await expect(createSocialPublisherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/approved copy/)
  })
})
