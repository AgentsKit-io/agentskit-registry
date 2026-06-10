import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEscalationDrafterAgent } from './agent'

describe('support-escalation-drafter', () => {
  it('runs against a mock adapter', async () => {
    const agent = createEscalationDrafterAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
