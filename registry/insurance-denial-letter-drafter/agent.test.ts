import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceDenialLetterDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_letter_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-denial-letter-drafter', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceDenialLetterDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-denial-letter-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceDenialLetterDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
