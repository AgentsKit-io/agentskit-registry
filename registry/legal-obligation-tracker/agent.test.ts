import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalObligationTrackerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_obligation_tracker', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-obligation-tracker', () => {
  it('returns typed output', async () => {
    const r = await createLegalObligationTrackerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-obligation-tracker')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalObligationTrackerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
