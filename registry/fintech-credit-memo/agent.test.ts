import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechCreditMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_credit_memo', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-credit-memo', () => {
  it('returns typed output', async () => {
    const r = await createFintechCreditMemoAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for fintech-credit-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createFintechCreditMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
