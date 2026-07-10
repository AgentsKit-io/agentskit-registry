import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceLgpdAssessorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_lgpd_assessor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('compliance-lgpd-assessor', () => {
  it('returns typed output', async () => {
    const r = await createComplianceLgpdAssessorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for compliance-lgpd-assessor')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createComplianceLgpdAssessorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
