import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationAccreditationEvidenceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_accreditation_evidence', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-accreditation-evidence', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationAccreditationEvidenceAgent({ adapter: model({ title: 'Accreditation Evidence', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-accreditation-evidence')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationAccreditationEvidenceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
