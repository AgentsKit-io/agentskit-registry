import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateMortgagePrequalMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_prequal_memo', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('realestate-mortgage-prequal-memo', () => {
  it('returns typed output', async () => {
    const r = await createRealestateMortgagePrequalMemoAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for realestate-mortgage-prequal-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createRealestateMortgagePrequalMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
