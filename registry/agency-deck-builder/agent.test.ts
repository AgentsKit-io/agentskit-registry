import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDeckBuilderAgent } from './agent'

describe('agency-deck-builder', () => {
  it('runs against a mock adapter', async () => {
    const agent = createDeckBuilderAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
