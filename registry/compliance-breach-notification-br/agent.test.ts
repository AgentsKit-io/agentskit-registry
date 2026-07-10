import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceBreachNotificationBrAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_notification_br', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('compliance-breach-notification-br', () => {
  it('returns typed output', async () => {
    const r = await createComplianceBreachNotificationBrAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for compliance-breach-notification-br')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createComplianceBreachNotificationBrAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
