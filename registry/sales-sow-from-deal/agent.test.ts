import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesSowFromDealAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_from_deal', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-sow-from-deal', () => {
  it('returns typed output', async () => {
    const r = await createSalesSowFromDealAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-sow-from-deal')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSalesSowFromDealAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
