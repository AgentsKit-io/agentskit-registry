import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPrivilegeSpotterAgent } from './agent'

describe('legal-privilege-spotter', () => {
  it('runs against a mock adapter', async () => {
    const agent = createPrivilegeSpotterAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
