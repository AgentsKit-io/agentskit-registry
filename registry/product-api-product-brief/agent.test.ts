import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductApiProductBriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_product_brief', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-api-product-brief', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductApiProductBriefAgent({ adapter: model({ title: 'API Product Brief', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for product-api-product-brief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductApiProductBriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
