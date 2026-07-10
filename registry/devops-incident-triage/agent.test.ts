import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsIncidentTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_incident_triage', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-incident-triage', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsIncidentTriageAgent({ adapter: model({ category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }) }).run('sample input for devops-incident-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })
  it('escalates critical red flags', async () => {
    const r = await createDevopsIncidentTriageAgent({ adapter: model({ category: 'x', severity: 'low', queue: 'q', rationale: 'm', gaps: [], openQuestions: [] }) }).run('full outage for all users')
    expect(r.severity).toBe('critical')
  })
  it('refuses empty input', async () => {
    await expect(createDevopsIncidentTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
