import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceClaimIntakeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_claim_intake', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-claim-intake', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceClaimIntakeAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-claim-intake')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceClaimIntakeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
