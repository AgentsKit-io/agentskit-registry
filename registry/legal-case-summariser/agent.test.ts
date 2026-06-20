import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCaseSummariserAgent } from './agent'

const BASE = {
  partiesAndCounsel: 'Acme (Smith LLP) v. Globex (Jones PC)',
  proceduralPosture: 'discovery',
  keyFacts: [{ fact: 'contract signed 2024-03', citation: 'DOC-12' }],
  openIssues: ['damages quantum'],
  conflicts: [],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_summary', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-case-summariser', () => {
  it('returns a typed cited summary, always a draft', async () => {
    const r = await createCaseSummariserAgent({ adapter: model(BASE) }).run('docs + notes')
    expect(r.summary.keyFacts[0].citation).toBe('DOC-12')
    expect(r.conflicts).toEqual([])
    expect(r.requiresAttorneyReview).toBe(true)
  })

  it('flags inconsistent notes as conflicts rather than picking a side', async () => {
    const r = await createCaseSummariserAgent({
      adapter: model({ ...BASE, conflicts: [{ issue: 'date of breach', positions: ['March per DOC-12', 'May per DOC-19'] }] }),
    }).run('docs + notes')
    expect(r.conflicts[0].issue).toBe('date of breach')
    expect(r.conflicts[0].positions).toHaveLength(2)
  })

  it('refuses empty input', async () => {
    await expect(createCaseSummariserAgent({ adapter: model(BASE) }).run('  ')).rejects.toThrow(/reviewed documents/)
  })
})
