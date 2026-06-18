import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDocsChatAgent } from './agent'

describe('docs-chat', () => {
  it('runs against a mock adapter', async () => {
    const agent = createDocsChatAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
