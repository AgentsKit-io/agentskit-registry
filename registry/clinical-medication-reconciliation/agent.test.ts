import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalMedicationReconciliationAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_medication_reconciliation', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('clinical-medication-reconciliation', () => {
  it('returns typed v1 output', async () => {
    const r = await createClinicalMedicationReconciliationAgent({ adapter: model({ title: 'Medication Reconciliation', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for clinical-medication-reconciliation')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createClinicalMedicationReconciliationAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
