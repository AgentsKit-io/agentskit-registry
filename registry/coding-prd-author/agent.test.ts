import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPrdAuthorAgent } from './agent'

describe('coding-prd-author', () => {
  it('runs against a mock adapter', async () => {
    const agent = createPrdAuthorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
