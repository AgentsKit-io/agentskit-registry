import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataWarehouseMigrationAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_warehouse_migration', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-warehouse-migration', () => {
  it('returns typed output', async () => {
    const r = await createDataWarehouseMigrationAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for data-warehouse-migration')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDataWarehouseMigrationAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
