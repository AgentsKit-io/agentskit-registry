import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechPaymentDisputeInvestigatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_dispute_investigator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('fintech-payment-dispute-investigator', () => {
  it('returns typed v1 output', async () => {
    const r = await createFintechPaymentDisputeInvestigatorAgent({ adapter: model({ title: 'Payment Dispute Investigator', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for fintech-payment-dispute-investigator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createFintechPaymentDisputeInvestigatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
