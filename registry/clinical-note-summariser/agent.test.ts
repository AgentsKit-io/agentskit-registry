import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createNoteSummariserAgent } from './agent'

describe('clinical-note-summariser', () => {
  it('runs against a mock adapter', async () => {
    const agent = createNoteSummariserAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
