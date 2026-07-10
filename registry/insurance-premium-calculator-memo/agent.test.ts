import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsurancePremiumCalculatorMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_calculator_memo', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-premium-calculator-memo', () => {
  it('returns typed output', async () => {
    const r = await createInsurancePremiumCalculatorMemoAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-premium-calculator-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createInsurancePremiumCalculatorMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
