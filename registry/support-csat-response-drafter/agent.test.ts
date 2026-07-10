import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportCsatResponseDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_response_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-csat-response-drafter', () => {
  it('returns typed output', async () => {
    const r = await createSupportCsatResponseDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for support-csat-response-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSupportCsatResponseDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
