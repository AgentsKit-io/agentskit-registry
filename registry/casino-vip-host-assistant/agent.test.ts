import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createVipHostAssistantAgent } from './agent'

describe('casino-vip-host-assistant', () => {
  it('runs against a mock adapter', async () => {
    const agent = createVipHostAssistantAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
