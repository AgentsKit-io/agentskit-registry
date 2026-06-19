import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDocsChatAgent } from './agent'

describe('docs-chat', () => {
  it('runs against a mock adapter and returns the grounded answer', async () => {
    const agent = createDocsChatAgent({
      adapter: mockAdapter({ response: [{ type: 'text', content: 'Set memory in config.ts (see Memory page).' }] }),
    })
    const r = await agent.run('How do I configure memory?')
    expect(r.content).toContain('Memory')
    expect(agent.name).toBe('docs-chat')
  })

  it('honours a custom systemPrompt override', async () => {
    const agent = createDocsChatAgent({
      adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }),
      systemPrompt: 'Custom grounded prompt.',
    })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
