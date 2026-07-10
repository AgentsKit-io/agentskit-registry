import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingFeatureFlagReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_flag_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-feature-flag-reviewer', () => {
  it('returns typed output', async () => {
    const r = await createCodingFeatureFlagReviewerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-feature-flag-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingFeatureFlagReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
