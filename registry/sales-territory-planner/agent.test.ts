import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesTerritoryPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_territory_planner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-territory-planner', () => {
  it('returns typed output', async () => {
    const r = await createSalesTerritoryPlannerAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-territory-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesTerritoryPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
