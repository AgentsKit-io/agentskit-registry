import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSignalDetectorAgent } from './agent'

describe('casino-signal-detector', () => {
  it('runs against a mock adapter', async () => {
    const agent = createSignalDetectorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
