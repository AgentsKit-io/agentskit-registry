import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesSowFromDealAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_from_deal', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-sow-from-deal', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesSowFromDealAgent({ adapter: model({ title: 'SOW from Deal', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-sow-from-deal')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesSowFromDealAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
