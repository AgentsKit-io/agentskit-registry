import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportMultilangReplyDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_reply_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-multilang-reply-drafter', () => {
  it('returns typed output', async () => {
    const r = await createSupportMultilangReplyDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for support-multilang-reply-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSupportMultilangReplyDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
