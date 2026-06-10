import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createQaAuthorAgent } from './agent'

describe('coding-qa-author', () => {
  it('runs against a mock adapter', async () => {
    const agent = createQaAuthorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
