import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPrReviewerAgent } from './agent'

describe('coding-pr-reviewer', () => {
  it('runs against a mock adapter', async () => {
    const agent = createPrReviewerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
