import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceRegulatoryFilingAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_regulatory_filing', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-regulatory-filing', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceRegulatoryFilingAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-regulatory-filing')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceRegulatoryFilingAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
