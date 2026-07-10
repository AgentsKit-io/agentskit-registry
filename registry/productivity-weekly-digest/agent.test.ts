import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductivityWeeklyDigestAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_weekly_digest', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('productivity-weekly-digest', () => {
  it('returns typed output', async () => {
    const r = await createProductivityWeeklyDigestAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for productivity-weekly-digest')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createProductivityWeeklyDigestAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
