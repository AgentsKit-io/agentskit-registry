import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevImplementerAgent } from './agent'

describe('coding-dev-implementer', () => {
  it('runs against a mock adapter', async () => {
    const agent = createDevImplementerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
