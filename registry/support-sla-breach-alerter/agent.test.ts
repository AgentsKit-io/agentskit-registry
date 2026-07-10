import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportSlaBreachAlerterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_breach_alerter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('support-sla-breach-alerter', () => {
  it('returns typed v1 output', async () => {
    const r = await createSupportSlaBreachAlerterAgent({ adapter: model({ title: 'SLA Breach Alerter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for support-sla-breach-alerter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSupportSlaBreachAlerterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
