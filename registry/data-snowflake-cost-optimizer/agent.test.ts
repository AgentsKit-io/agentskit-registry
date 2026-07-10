import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataSnowflakeCostOptimizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_cost_optimizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-snowflake-cost-optimizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataSnowflakeCostOptimizerAgent({ adapter: model({ title: 'Snowflake Cost Optimizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-snowflake-cost-optimizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataSnowflakeCostOptimizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
