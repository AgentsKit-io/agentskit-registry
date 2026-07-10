import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingEmailSequenceAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_sequence_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-email-sequence-author', () => {
  it('returns typed output', async () => {
    const r = await createMarketingEmailSequenceAuthorAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for marketing-email-sequence-author')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createMarketingEmailSequenceAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
