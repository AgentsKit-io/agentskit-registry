import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechInsuranceClaimTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_claim_triage', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('fintech-insurance-claim-triage', () => {
  it('returns typed v1 output', async () => {
    const r = await createFintechInsuranceClaimTriageAgent({ adapter: model({ category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }) }).run('sample input for fintech-insurance-claim-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })
  it('escalates critical red flags', async () => {
    const r = await createFintechInsuranceClaimTriageAgent({ adapter: model({ category: 'x', severity: 'low', queue: 'q', rationale: 'm', gaps: [], openQuestions: [] }) }).run('full outage for all users')
    expect(r.severity).toBe('critical')
  })
  it('refuses empty input', async () => {
    await expect(createFintechInsuranceClaimTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
