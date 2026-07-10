import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceSupplierCommunicatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_supplier_communicator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-supplier-communicator', () => {
  it('returns typed output', async () => {
    const r = await createEcommerceSupplierCommunicatorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-supplier-communicator')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEcommerceSupplierCommunicatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
