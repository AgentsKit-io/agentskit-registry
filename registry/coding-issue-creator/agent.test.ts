import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createIssueCreatorAgent } from './agent'

describe('coding-issue-creator', () => {
  it('runs against a mock adapter', async () => {
    const agent = createIssueCreatorAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
