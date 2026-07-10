import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesEmailPersonalizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_email_personalizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-email-personalizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesEmailPersonalizerAgent({ adapter: model({ title: 'Email Personalizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-email-personalizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesEmailPersonalizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
