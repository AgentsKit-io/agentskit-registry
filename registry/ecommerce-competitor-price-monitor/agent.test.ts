import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceCompetitorPriceMonitorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_price_monitor', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-competitor-price-monitor', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceCompetitorPriceMonitorAgent({ adapter: model({ title: 'Competitor Price Monitor', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-competitor-price-monitor')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceCompetitorPriceMonitorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
