import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingUtmPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_utm_planner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-utm-planner', () => {
  it('returns typed output', async () => {
    const r = await createMarketingUtmPlannerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for marketing-utm-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createMarketingUtmPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
