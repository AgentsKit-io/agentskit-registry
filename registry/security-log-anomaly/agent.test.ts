import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityLogAnomalyAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_log_anomaly', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-log-anomaly', () => {
  it('returns typed output', async () => {
    const r = await createSecurityLogAnomalyAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for security-log-anomaly')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSecurityLogAnomalyAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
