import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createIncidentSummariserAgent } from './agent'

describe('casino-incident-summariser', () => {
  it('runs against a mock adapter', async () => {
    const agent = createIncidentSummariserAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
