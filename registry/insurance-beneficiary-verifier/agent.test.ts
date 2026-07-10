import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceBeneficiaryVerifierAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_beneficiary_verifier', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-beneficiary-verifier', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceBeneficiaryVerifierAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-beneficiary-verifier')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceBeneficiaryVerifierAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
