import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingRunbookFromIncidentAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_from_incident', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('coding-runbook-from-incident', () => {
  it('returns typed v1 output', async () => {
    const r = await createCodingRunbookFromIncidentAgent({ adapter: model({ title: 'Runbook from Incident', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for coding-runbook-from-incident')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createCodingRunbookFromIncidentAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
