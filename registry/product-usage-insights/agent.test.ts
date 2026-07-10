import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductUsageInsightsAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_usage_insights', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-usage-insights', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductUsageInsightsAgent({ adapter: model({ title: 'Usage Insights', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for product-usage-insights')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductUsageInsightsAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
