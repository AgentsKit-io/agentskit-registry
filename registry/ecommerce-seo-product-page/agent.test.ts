import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceSeoProductPageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_product_page', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-seo-product-page', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceSeoProductPageAgent({ adapter: model({ title: 'Product SEO', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-seo-product-page')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceSeoProductPageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
