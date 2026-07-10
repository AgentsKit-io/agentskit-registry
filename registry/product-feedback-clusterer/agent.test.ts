import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductFeedbackClustererAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_feedback_clusterer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-feedback-clusterer', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductFeedbackClustererAgent({ adapter: model({ summary: 'ok', clusters: [{ name: 'c1', theme: 't', items: ['a'] }], unassigned: [] }) }).run('sample input for product-feedback-clusterer')
    expect(r.requiresReview).toBe(true)
    expect(r.clusters.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductFeedbackClustererAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
