import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSocialPublisherAgent } from './agent'

describe('marketing-social-publisher', () => {
  it('runs against a mock adapter', async () => {
    const agent = createSocialPublisherAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
