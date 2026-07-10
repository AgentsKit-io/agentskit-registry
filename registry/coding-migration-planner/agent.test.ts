import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingMigrationPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_migration_planner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-migration-planner', () => {
  it('returns typed output', async () => {
    const r = await createCodingMigrationPlannerAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-migration-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingMigrationPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
