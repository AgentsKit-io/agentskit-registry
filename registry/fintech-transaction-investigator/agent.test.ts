import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTransactionInvestigatorAgent } from './agent'

const F = (severity: string, id = 'f1') => ({
  id,
  severity,
  title: 'Structuring pattern',
  detail: 'Six $9,500 deposits in 48h across two branches.',
  category: 'structuring',
  location: 'TX-101, TX-102, TX-103',
  confidence: 0.8,
  remediation: 'Escalate to AML investigator',
})
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_case', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-transaction-investigator', () => {
  it('returns typed findings, computes highest severity, always requires human review', async () => {
    const r = await createTransactionInvestigatorAgent({ adapter: model({ findings: [F('low'), F('high', 'f2')], summary: 's', insufficientEvidence: false }), mode: 'aml' }).run('history')
    expect(r.mode).toBe('aml')
    expect(r.findings).toHaveLength(2)
    expect(r.highestSeverity).toBe('high')
    expect(r.requiresHumanReview).toBe(true)
    expect(r.findings[0].location).toMatch(/TX-101/)
  })

  it('surfaces insufficientEvidence rather than over-claiming', async () => {
    const r = await createTransactionInvestigatorAgent({ adapter: model({ findings: [], summary: 'thin', insufficientEvidence: true }) }).run('history')
    expect(r.insufficientEvidence).toBe(true)
    expect(r.highestSeverity).toBeNull()
    expect(r.requiresHumanReview).toBe(true)
  })

  it('fails safe (no silent all-clear) when the model output is unparseable', async () => {
    const bad = mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: 't', name: 'submit_case', args: '{not json' } }, { type: 'done' }] })
    const r = await createTransactionInvestigatorAgent({ adapter: bad }).run('history')
    expect(r.insufficientEvidence).toBe(true)
    expect(r.findings).toEqual([])
    expect(r.requiresHumanReview).toBe(true)
  })

  it('refuses empty history', async () => {
    await expect(createTransactionInvestigatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/history/)
  })
})
