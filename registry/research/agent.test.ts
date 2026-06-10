import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchAgent } from './agent'

describe('research agent', () => {
  it('constructs and runs against a mock adapter', async () => {
    const agent = createResearchAgent({
      adapter: mockAdapter({
        response: [{ type: 'text', content: 'AgentsKit is an agent toolkit. [source](https://agentskit.io)' }],
      }),
    })
    const result = await agent.run('What is AgentsKit?')
    expect(result.content).toContain('AgentsKit')
    expect(result.steps).toBeGreaterThanOrEqual(1)
  })
})
