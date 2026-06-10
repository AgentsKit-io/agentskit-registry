import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCompetitorResearcherAgent } from './agent'

describe('marketing-competitor-researcher', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCompetitorResearcherAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
