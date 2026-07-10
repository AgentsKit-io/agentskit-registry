import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductCompetitiveFeatureGapAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_feature_gap', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-competitive-feature-gap', () => {
  it('returns typed output', async () => {
    const r = await createProductCompetitiveFeatureGapAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for product-competitive-feature-gap')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createProductCompetitiveFeatureGapAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
