import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommercePromoPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_promo_planner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-promo-planner', () => {
  it('returns typed output', async () => {
    const r = await createEcommercePromoPlannerAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-promo-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEcommercePromoPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
