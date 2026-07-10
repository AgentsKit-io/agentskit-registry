import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesCallDebriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_call_debrief', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-call-debrief', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesCallDebriefAgent({ adapter: model({ title: 'Call Debrief', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-call-debrief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesCallDebriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
