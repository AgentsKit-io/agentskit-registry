import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentYoutubeMetadataAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_youtube_metadata', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-youtube-metadata', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentYoutubeMetadataAgent({ adapter: model({ title: 'YouTube Metadata', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for content-youtube-metadata')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentYoutubeMetadataAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
