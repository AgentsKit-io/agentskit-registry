import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPatientSummaryAgent } from './agent'

const FULL = {
  reasonForVisit: 'HTN follow-up',
  activeProblems: ['hypertension', 'hyperlipidemia'],
  medications: ['lisinopril', 'atorvastatin'],
  allergies: ['penicillin'],
  vitalsTrend: 'BP improving',
  followUps: ['lipid panel'],
  openQuestions: ['adherence?'],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_summary', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-patient-summary', () => {
  it('produces a typed structured summary, always a draft', async () => {
    const r = await createPatientSummaryAgent({ adapter: model(FULL) }).run('chart excerpts')
    expect(r.summary.reasonForVisit).toBe('HTN follow-up')
    expect(r.summary.activeProblems).toContain('hypertension')
    expect(r.summary.medications).toContain('lisinopril')
    expect(r.requiresClinicianSignoff).toBe(true)
  })

  it('refuses empty chart excerpts', async () => {
    await expect(createPatientSummaryAgent({ adapter: model(FULL) }).run('  ')).rejects.toThrow(/chart/)
  })
})
