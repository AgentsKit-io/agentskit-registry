import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTransactionMonitorAgent } from './agent'

describe('fintech-transaction-monitor', () => {
  it('runs against a mock adapter', async () => {
    const agent = createTransactionMonitorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
