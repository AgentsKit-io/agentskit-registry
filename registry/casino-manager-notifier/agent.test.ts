import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createManagerNotifierAgent } from './agent'

describe('casino-manager-notifier', () => {
  it('runs against a mock adapter', async () => {
    const agent = createManagerNotifierAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
