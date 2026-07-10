import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportFeatureClustererAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_feature_clusterer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-feature-clusterer', () => {
  it('returns typed output', async () => {
    const r = await createSupportFeatureClustererAgent({ adapter: model({"summary":"ok","clusters":[{"name":"c1","theme":"t","items":["a"]}],"unassigned":[]}) }).run('sample input for support-feature-clusterer')
    expect(r.requiresReview).toBe(true)
    expect(r.clusters.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSupportFeatureClustererAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
