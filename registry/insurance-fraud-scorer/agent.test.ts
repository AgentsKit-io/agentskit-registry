import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceFraudScorerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_fraud_scorer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-fraud-scorer', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceFraudScorerAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for insurance-fraud-scorer')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceFraudScorerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
