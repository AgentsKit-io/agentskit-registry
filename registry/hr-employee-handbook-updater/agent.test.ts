import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrEmployeeHandbookUpdaterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_handbook_updater', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-employee-handbook-updater', () => {
  it('returns typed output', async () => {
    const r = await createHrEmployeeHandbookUpdaterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-employee-handbook-updater')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrEmployeeHandbookUpdaterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
