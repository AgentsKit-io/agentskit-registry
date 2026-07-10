import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceReturnTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_return_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-return-triage', () => {
  it('returns typed output', async () => {
    const r = await createEcommerceReturnTriageAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-return-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createEcommerceReturnTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
