import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrPerformanceReviewAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_review_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-performance-review-author', () => {
  it('returns typed output', async () => {
    const r = await createHrPerformanceReviewAuthorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-performance-review-author')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createHrPerformanceReviewAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
