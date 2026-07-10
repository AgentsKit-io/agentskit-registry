import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceReviewResponderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_review_responder', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-review-responder', () => {
  it('returns typed output', async () => {
    const r = await createEcommerceReviewResponderAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-review-responder')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEcommerceReviewResponderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
