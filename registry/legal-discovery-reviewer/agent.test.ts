import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDiscoveryReviewerAgent } from './agent'

describe('legal-discovery-reviewer', () => {
  it('runs against a mock adapter', async () => {
    const agent = createDiscoveryReviewerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
