import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createReleaseNotesDrafterAgent } from './agent'

const PAYLOAD = {
  groups: [
    { type: 'Feature', entries: [{ text: 'add password reset', pr: 101 }] },
    { type: 'Fix', entries: [{ text: 'fix token expiry', pr: 102 }] },
  ],
  markdown: '## Features\n- add password reset (#101)\n## Fixes\n- fix token expiry (#102)',
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_notes', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-release-notes-drafter', () => {
  it('returns typed grouped notes citing PR numbers, always a draft', async () => {
    const r = await createReleaseNotesDrafterAgent({ adapter: model(PAYLOAD) }).run('PR #101 ...\nPR #102 ...')
    expect(r.groups[0].type).toBe('Feature')
    expect(r.groups[0].entries[0].pr).toBe(101)
    expect(r.markdown).toMatch(/#101/)
    expect(r.requiresReview).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createReleaseNotesDrafterAgent({ adapter: model(PAYLOAD) }).run('  ')).rejects.toThrow(/merged PRs/)
  })
})
