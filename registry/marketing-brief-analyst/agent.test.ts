import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createBriefAnalystAgent } from './agent'

describe('marketing-brief-analyst', () => {
  it('runs against a mock adapter', async () => {
    const agent = createBriefAnalystAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
