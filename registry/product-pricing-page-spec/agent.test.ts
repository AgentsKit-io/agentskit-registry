import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductPricingPageSpecAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_page_spec', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-pricing-page-spec', () => {
  it('returns typed output', async () => {
    const r = await createProductPricingPageSpecAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-pricing-page-spec')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductPricingPageSpecAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
