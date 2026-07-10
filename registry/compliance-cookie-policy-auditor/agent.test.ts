import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceCookiePolicyAuditorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_auditor', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('compliance-cookie-policy-auditor', () => {
  it('returns typed v1 output', async () => {
    const r = await createComplianceCookiePolicyAuditorAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for compliance-cookie-policy-auditor')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createComplianceCookiePolicyAuditorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
