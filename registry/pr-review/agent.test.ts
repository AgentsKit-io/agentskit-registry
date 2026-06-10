import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPRReviewAgent } from './agent'

describe('pr-review agent', () => {
  it('constructs and runs against a mock adapter', async () => {
    const agent = createPRReviewAgent({
      adapter: mockAdapter({
        response: [{ type: 'text', content: 'LGTM. One nit: add a test for the error path.' }],
      }),
      githubToken: 'test-token',
    })
    const result = await agent.run('Review PR #1')
    expect(result.content).toContain('nit')
    expect(result.steps).toBeGreaterThanOrEqual(1)
  })
})
