import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceAgentCommissionAuditAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_commission_audit', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-agent-commission-audit', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceAgentCommissionAuditAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-agent-commission-audit')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceAgentCommissionAuditAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
