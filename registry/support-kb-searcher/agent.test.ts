import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createKbSearcherAgent } from './agent'

describe('support-kb-searcher', () => {
  it('runs against a mock adapter', async () => {
    const agent = createKbSearcherAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
