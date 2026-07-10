import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportHealthSummaryAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_health_summary', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-health-summary', () => {
  it('returns typed output', async () => {
    const r = await createSupportHealthSummaryAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for support-health-summary')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSupportHealthSummaryAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
