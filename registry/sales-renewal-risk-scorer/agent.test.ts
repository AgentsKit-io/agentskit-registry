import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesRenewalRiskScorerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_risk_scorer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-renewal-risk-scorer', () => {
  it('returns typed output', async () => {
    const r = await createSalesRenewalRiskScorerAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for sales-renewal-risk-scorer')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createSalesRenewalRiskScorerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
