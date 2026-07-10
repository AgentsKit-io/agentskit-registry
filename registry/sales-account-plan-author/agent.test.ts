import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesAccountPlanAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_plan_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-account-plan-author', () => {
  it('returns typed output', async () => {
    const r = await createSalesAccountPlanAuthorAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-account-plan-author')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesAccountPlanAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
