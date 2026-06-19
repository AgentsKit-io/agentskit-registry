import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createReferralRouterAgent } from './agent'

const model = (payload: Record<string, unknown> | 'silent') =>
  mockAdapter({
    response: () =>
      payload === 'silent'
        ? [{ type: 'text', content: 'no routing' }, { type: 'done' }]
        : [
            { type: 'tool_call', toolCall: { id: 't', name: 'submit_routing', args: JSON.stringify({ missingFields: [], ...payload }) } },
            { type: 'done' },
          ],
  })

describe('clinical-referral-router', () => {
  it('routes a complete packet to the specialty + urgency', async () => {
    const r = await createReferralRouterAgent({ adapter: model({ specialty: 'cardiology', urgency: 'soon', rationale: 'abnormal ECG' }) }).run('referral: abnormal ECG, on metoprolol, prior stress test')
    expect(r.specialty).toBe('cardiology')
    expect(r.urgency).toBe('soon')
    expect(r.requiresHumanReview).toBe(false)
  })

  it('does NOT assign an incomplete packet — flags missing fields + human review', async () => {
    const r = await createReferralRouterAgent({ adapter: model({ specialty: 'unclear', urgency: 'unclear', rationale: 'incomplete', missingFields: ['reason for referral', 'current medications'] }) }).run('partial packet')
    expect(r.missingFields).toContain('reason for referral')
    expect(r.requiresHumanReview).toBe(true)
  })

  it('FAIL-SAFE: a failed routing escalates to a human coordinator', async () => {
    const r = await createReferralRouterAgent({ adapter: model('silent') }).run('packet')
    expect(r.urgency).toBe('unclear')
    expect(r.requiresHumanReview).toBe(true)
  })

  it('refuses an empty packet', async () => {
    await expect(createReferralRouterAgent({ adapter: model({ specialty: 'x', urgency: 'routine', rationale: 'r' }) }).run('  ')).rejects.toThrow(/packet/)
  })
})
