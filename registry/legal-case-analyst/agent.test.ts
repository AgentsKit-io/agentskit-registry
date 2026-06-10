import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCaseAnalystAgent } from './agent'

describe('legal-case-analyst', () => {
  it('runs against a mock adapter', async () => {
    const agent = createCaseAnalystAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
