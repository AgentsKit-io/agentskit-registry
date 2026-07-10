import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductUsageInsightsAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_usage_insights', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-usage-insights', () => {
  it('returns typed output', async () => {
    const r = await createProductUsageInsightsAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-usage-insights')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductUsageInsightsAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
