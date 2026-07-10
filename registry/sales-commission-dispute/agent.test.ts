import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesCommissionDisputeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_commission_dispute', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-commission-dispute', () => {
  it('returns typed output', async () => {
    const r = await createSalesCommissionDisputeAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-commission-dispute')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSalesCommissionDisputeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
