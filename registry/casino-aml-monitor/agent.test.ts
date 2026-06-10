import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAmlMonitorAgent } from './agent'

describe('casino-aml-monitor', () => {
  it('runs against a mock adapter', async () => {
    const agent = createAmlMonitorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
