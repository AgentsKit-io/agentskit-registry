import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalBillingCodeSuggesterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_code_suggester', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-billing-code-suggester', () => {
  it('returns typed output', async () => {
    const r = await createClinicalBillingCodeSuggesterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for clinical-billing-code-suggester')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createClinicalBillingCodeSuggesterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
