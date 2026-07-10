import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateOfferLetterDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_letter_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('realestate-offer-letter-drafter', () => {
  it('returns typed output', async () => {
    const r = await createRealestateOfferLetterDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for realestate-offer-letter-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createRealestateOfferLetterDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
