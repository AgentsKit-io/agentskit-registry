import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalClauseComparatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_clause_comparator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-clause-comparator', () => {
  it('returns typed output', async () => {
    const r = await createLegalClauseComparatorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-clause-comparator')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalClauseComparatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
