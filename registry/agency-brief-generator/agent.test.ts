import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createBriefGeneratorAgent } from './agent'

describe('agency-brief-generator', () => {
  it('runs against a mock adapter', async () => {
    const agent = createBriefGeneratorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
