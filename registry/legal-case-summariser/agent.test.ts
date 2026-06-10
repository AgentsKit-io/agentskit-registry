import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCaseSummariserAgent } from './agent'

describe('legal-case-summariser', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCaseSummariserAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
