import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTriageBotAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-triage-bot', () => {
  it('returns a typed classification', async () => {
    const r = await createTriageBotAgent({ adapter: model({ topic: 'billing', severity: 'P3', queue: 'billing', rationale: 'routine billing question' }) }).run('How do I change my billing email?')
    expect(r.severity).toBe('P3')
    expect(r.queue).toBe('billing')
    expect(r.redFlagsHit).toEqual([])
  })

  it('forces P1 + incident queue when a red flag fires, even if the model says P3', async () => {
    const r = await createTriageBotAgent({ adapter: model({ topic: 'login', severity: 'P3', queue: 'general', rationale: 'looks minor' }) }).run('Our API is returning 503 and is fully down for all users')
    expect(r.severity).toBe('P1')
    expect(r.queue).toBe('incident')
    expect(r.redFlagsHit.length).toBeGreaterThan(0)
    expect(r.rationale).toMatch(/forced P1/)
  })

  it('does not downgrade a model-issued P1', async () => {
    const r = await createTriageBotAgent({ adapter: model({ topic: 'security', severity: 'P1', queue: 'incident', rationale: 'breach' }) }).run('suspected data breach, customer PII exposed')
    expect(r.severity).toBe('P1')
  })

  it('refuses an empty ticket', async () => {
    await expect(createTriageBotAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/ticket/)
  })
})
