import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createReferralRouterAgent } from './agent'

describe('clinical-referral-router', () => {
  it('runs against a mock adapter', async () => {
    const agent = createReferralRouterAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
