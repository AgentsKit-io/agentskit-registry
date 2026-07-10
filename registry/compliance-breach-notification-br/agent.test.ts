import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceBreachNotificationBrAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_notification_br', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('compliance-breach-notification-br', () => {
  it('returns typed v1 output', async () => {
    const r = await createComplianceBreachNotificationBrAgent({ adapter: model({ title: 'Breach Notification BR', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for compliance-breach-notification-br')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createComplianceBreachNotificationBrAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
