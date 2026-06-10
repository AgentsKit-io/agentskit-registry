import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createKycScreenerAgent } from './agent'

describe('fintech-kyc-screener', () => {
  it('runs against a mock adapter', async () => {
    const agent = createKycScreenerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
