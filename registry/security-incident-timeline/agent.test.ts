import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityIncidentTimelineAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_incident_timeline', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('security-incident-timeline', () => {
  it('returns typed v1 output', async () => {
    const r = await createSecurityIncidentTimelineAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for security-incident-timeline')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSecurityIncidentTimelineAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
