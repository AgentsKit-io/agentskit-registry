import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTriageBotAgent } from './agent'

describe('support-triage-bot', () => {
  it('runs against a mock adapter', async () => {
    const agent = createTriageBotAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
