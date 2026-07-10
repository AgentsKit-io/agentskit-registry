import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductPricingPageSpecAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_page_spec', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-pricing-page-spec', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductPricingPageSpecAgent({ adapter: model({ title: 'Pricing Page Spec', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for product-pricing-page-spec')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductPricingPageSpecAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
