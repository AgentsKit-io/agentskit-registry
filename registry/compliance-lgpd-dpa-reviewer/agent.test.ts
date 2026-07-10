import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceLgpdDpaReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_dpa_reviewer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('compliance-lgpd-dpa-reviewer', () => {
  it('returns typed v1 output', async () => {
    const r = await createComplianceLgpdDpaReviewerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for compliance-lgpd-dpa-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createComplianceLgpdDpaReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
