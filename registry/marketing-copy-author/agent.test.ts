import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCopyAuthorAgent } from './agent'

describe('marketing-copy-author', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCopyAuthorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
