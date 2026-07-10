import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalObligationTrackerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_obligation_tracker', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('legal-obligation-tracker', () => {
  it('returns typed v1 output', async () => {
    const r = await createLegalObligationTrackerAgent({ adapter: model({ title: 'Obligation Tracker', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for legal-obligation-tracker')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createLegalObligationTrackerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
