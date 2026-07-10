import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductPrdFromInterviewsAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_from_interviews', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-prd-from-interviews', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductPrdFromInterviewsAgent({ adapter: model({ title: 'PRD from Interviews', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for product-prd-from-interviews')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductPrdFromInterviewsAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
