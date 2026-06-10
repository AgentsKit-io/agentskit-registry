import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSanctionsScreenerAgent } from './agent'

describe('fintech-sanctions-screener', () => {
  it('runs against a mock adapter', async () => {
    const agent = createSanctionsScreenerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
