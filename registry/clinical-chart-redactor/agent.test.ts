import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createChartRedactorAgent } from './agent'

describe('clinical-chart-redactor', () => {
  it('runs against a mock adapter', async () => {
    const agent = createChartRedactorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
