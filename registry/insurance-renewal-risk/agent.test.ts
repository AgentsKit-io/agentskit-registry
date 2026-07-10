import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceRenewalRiskAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_renewal_risk', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('insurance-renewal-risk', () => {
  it('returns typed v1 output', async () => {
    const r = await createInsuranceRenewalRiskAgent({ adapter: model({ score: 42, band: 'medium', factors: ['f1'], rationale: 'r', gaps: [] }) }).run('sample input for insurance-renewal-risk')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBeGreaterThanOrEqual(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createInsuranceRenewalRiskAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
