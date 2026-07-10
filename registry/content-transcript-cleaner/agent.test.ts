import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentTranscriptCleanerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_transcript_cleaner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-transcript-cleaner', () => {
  it('returns typed output', async () => {
    const r = await createContentTranscriptCleanerAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for content-transcript-cleaner')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createContentTranscriptCleanerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
