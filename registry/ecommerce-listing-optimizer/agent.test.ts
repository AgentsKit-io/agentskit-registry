import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceListingOptimizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_listing_optimizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-listing-optimizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceListingOptimizerAgent({ adapter: model({ title: 'Listing Optimizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-listing-optimizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceListingOptimizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
