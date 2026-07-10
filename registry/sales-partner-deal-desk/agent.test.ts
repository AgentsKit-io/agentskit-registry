import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesPartnerDealDeskAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_deal_desk', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-partner-deal-desk', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesPartnerDealDeskAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for sales-partner-deal-desk')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesPartnerDealDeskAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
