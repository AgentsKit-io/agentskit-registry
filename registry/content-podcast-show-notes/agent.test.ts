import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentPodcastShowNotesAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_show_notes', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-podcast-show-notes', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentPodcastShowNotesAgent({ adapter: model({ title: 'Podcast Show Notes', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for content-podcast-show-notes')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentPodcastShowNotesAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
