import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceSupplierCommunicatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_supplier_communicator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-supplier-communicator', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceSupplierCommunicatorAgent({ adapter: model({ title: 'Supplier Communicator', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-supplier-communicator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceSupplierCommunicatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
