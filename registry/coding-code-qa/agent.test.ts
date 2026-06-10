import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodeQaAgent } from './agent'

describe('coding-code-qa', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCodeQaAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
