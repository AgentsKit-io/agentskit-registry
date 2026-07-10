import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductivityEmailTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_email_triage', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('productivity-email-triage', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductivityEmailTriageAgent({ adapter: model({ category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }) }).run('sample input for productivity-email-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })
  it('escalates critical red flags', async () => {
    const r = await createProductivityEmailTriageAgent({ adapter: model({ category: 'x', severity: 'low', queue: 'q', rationale: 'm', gaps: [], openQuestions: [] }) }).run('full outage for all users')
    expect(r.severity).toBe('critical')
  })
  it('refuses empty input', async () => {
    await expect(createProductivityEmailTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
