import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalDepositionPrepAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_deposition_prep', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-deposition-prep', () => {
  it('returns typed output', async () => {
    const r = await createLegalDepositionPrepAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-deposition-prep')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalDepositionPrepAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
