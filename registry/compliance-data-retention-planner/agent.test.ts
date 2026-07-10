import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceDataRetentionPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_retention_planner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('compliance-data-retention-planner', () => {
  it('returns typed output', async () => {
    const r = await createComplianceDataRetentionPlannerAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for compliance-data-retention-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createComplianceDataRetentionPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
