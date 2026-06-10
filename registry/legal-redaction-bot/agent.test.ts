import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRedactionBotAgent } from './agent'

describe('legal-redaction-bot', () => {
  it('runs against a mock adapter', async () => {
    const agent = createRedactionBotAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
