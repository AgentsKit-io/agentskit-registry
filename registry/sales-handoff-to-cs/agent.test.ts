import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesHandoffToCsAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_to_cs', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-handoff-to-cs', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesHandoffToCsAgent({ adapter: model({ title: 'Sales to CS Handoff', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-handoff-to-cs')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesHandoffToCsAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
