import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsComplianceEvidenceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_compliance_evidence', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-compliance-evidence', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsComplianceEvidenceAgent({ adapter: model({ title: 'Compliance Evidence', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for devops-compliance-evidence')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsComplianceEvidenceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
