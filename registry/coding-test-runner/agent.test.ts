import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTestRunnerAgent } from './agent'

describe('coding-test-runner', () => {
  it('runs against a mock adapter', async () => {
    const agent = createTestRunnerAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
