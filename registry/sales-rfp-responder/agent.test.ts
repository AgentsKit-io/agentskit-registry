import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesRfpResponderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_rfp_responder', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-rfp-responder', () => {
  it('returns typed output', async () => {
    const r = await createSalesRfpResponderAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-rfp-responder')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSalesRfpResponderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
