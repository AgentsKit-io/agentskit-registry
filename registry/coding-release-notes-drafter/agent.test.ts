import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createReleaseNotesDrafterAgent } from './agent'

describe('coding-release-notes-drafter', () => {
  it('runs against a mock adapter', async () => {
    const agent = createReleaseNotesDrafterAgent({ adapter: mockAdapter({ response: [{ type: 'text', content: 'ok' }] }) })
    const r = await agent.run('test')
    expect(r.content).toBe('ok')
  })
})
