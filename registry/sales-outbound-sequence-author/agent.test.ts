import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesOutboundSequenceAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_sequence_author', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-outbound-sequence-author', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesOutboundSequenceAuthorAgent({ adapter: model({ title: 'Outbound Sequence Author', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-outbound-sequence-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesOutboundSequenceAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
