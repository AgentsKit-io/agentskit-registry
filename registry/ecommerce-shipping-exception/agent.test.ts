import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceShippingExceptionAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_shipping_exception', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-shipping-exception', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceShippingExceptionAgent({ adapter: model({ title: 'Shipping Exception', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-shipping-exception')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceShippingExceptionAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
