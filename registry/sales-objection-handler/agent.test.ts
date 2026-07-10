import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesObjectionHandlerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_objection_handler', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-objection-handler', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesObjectionHandlerAgent({ adapter: model({ title: 'Objection Handler', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-objection-handler')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesObjectionHandlerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
