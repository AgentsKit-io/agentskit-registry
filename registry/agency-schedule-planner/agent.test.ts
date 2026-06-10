import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSchedulePlannerAgent } from './agent'

describe('agency-schedule-planner', () => {
  it('runs against a mock adapter', async () => {
    const agent = createSchedulePlannerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
