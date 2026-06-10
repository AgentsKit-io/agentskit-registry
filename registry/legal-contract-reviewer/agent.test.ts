import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContractReviewerAgent } from './agent'

describe('legal-contract-reviewer', () => {
  it('runs against a mock adapter', async () => {
    const agent = createContractReviewerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
