import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDocDrafterAgent } from './agent'

describe('legal-doc-drafter', () => {
  it('runs against a mock adapter', async () => {
    const agent = createDocDrafterAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
