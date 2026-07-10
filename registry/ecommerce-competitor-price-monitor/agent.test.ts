import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceCompetitorPriceMonitorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_price_monitor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-competitor-price-monitor', () => {
  it('returns typed output', async () => {
    const r = await createEcommerceCompetitorPriceMonitorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-competitor-price-monitor')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEcommerceCompetitorPriceMonitorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
