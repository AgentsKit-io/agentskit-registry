import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createBehaviorAnalyserAgent } from './agent'

describe('casino-behavior-analyser', () => {
  it('runs against a mock adapter', async () => {
    const agent = createBehaviorAnalyserAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
