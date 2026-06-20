import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCaseAnalystAgent } from './agent'

const c = (value: string, citation = 'Doc 1 p.2') => ({ value, citation })
const FULL = {
  parties: [c('Acme v. Globex')],
  jurisdictionVenue: c('N.D. Cal.'),
  proceduralPosture: c('motion to dismiss pending'),
  claims: [c('breach of contract')],
  defenses: [c('statute of limitations')],
  keyDates: [c('filed 2025-01-10')],
  openDiscovery: [c('RFP set 1')],
  deadlineRisks: ['SOL may bar claim 2 — filed 4y after accrual'],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_analysis', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-case-analyst', () => {
  it('returns a typed cited analysis + surfaces deadline risks, always a draft', async () => {
    const r = await createCaseAnalystAgent({ adapter: model(FULL) }).run('case file')
    expect(r.analysis.claims[0].citation).toBe('Doc 1 p.2')
    expect(r.deadlineRisks[0]).toMatch(/SOL/)
    expect(r.requiresAttorneyReview).toBe(true)
  })

  it('carries "not in record" through rather than inferring', async () => {
    const r = await createCaseAnalystAgent({ adapter: model({ ...FULL, defenses: [c('not in record', 'not in record')] }) }).run('case file')
    expect(r.analysis.defenses[0].value).toBe('not in record')
  })

  it('refuses an empty case file', async () => {
    await expect(createCaseAnalystAgent({ adapter: model(FULL) }).run('  ')).rejects.toThrow(/case file/)
  })
})
