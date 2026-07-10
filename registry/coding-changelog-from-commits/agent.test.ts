import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingChangelogFromCommitsAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_from_commits', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-changelog-from-commits', () => {
  it('returns typed output', async () => {
    const r = await createCodingChangelogFromCommitsAgent({ adapter: model({"summary":"ok","clusters":[{"name":"c1","theme":"t","items":["a"]}],"unassigned":[]}) }).run('sample input for coding-changelog-from-commits')
    expect(r.requiresReview).toBe(true)
    expect(r.clusters.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingChangelogFromCommitsAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
