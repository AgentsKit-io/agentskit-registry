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
  it('returns typed LGPD findings', async () => {
    const r = await createComplianceLgpdAssessorAgent({
      adapter: model({
        summary: 'marketing flow',
        findings: [{ id: 'f1', severity: 'medium', article: 'Art. 7', message: 'consent basis cited', source: 'signup' }],
        gaps: [],
        openQuestions: [],
      }),
    }).run('Marketing emails with consent checkbox on signup')
    expect(r.findings[0].article).toMatch(/Art/)
    expect(r.requiresReview).toBe(true)
  })

  it('adds Art. 48 finding on breach signal via safety net', async () => {
    const r = await createComplianceLgpdAssessorAgent({
      adapter: model({ summary: 'incident', findings: [], gaps: [], openQuestions: [] }),
    }).run('Security breach exposed customer CPF numbers')
    expect(r.findings.some((f) => f.severity === 'critical' && /48|breach/i.test(`${f.article} ${f.message}`))).toBe(true)
  })

  it('adds Art. 14 finding for child data via safety net', async () => {
    const r = await createComplianceLgpdAssessorAgent({
      adapter: model({ summary: 'school', findings: [], gaps: [], openQuestions: [] }),
    }).run('Collects child birthdays in school portal')
    expect(r.findings.some((f) => /14|menor|child/i.test(`${f.article} ${f.message}`))).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createComplianceLgpdAssessorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})