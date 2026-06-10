import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCopyReviewerAgent } from './agent'

describe('agency-copy-reviewer', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCopyReviewerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
