import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentYoutubeMetadataAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_youtube_metadata', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-youtube-metadata', () => {
  it('returns typed output', async () => {
    const r = await createContentYoutubeMetadataAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for content-youtube-metadata')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createContentYoutubeMetadataAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
