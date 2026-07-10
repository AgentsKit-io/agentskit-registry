import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceInventoryReorderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_inventory_reorder', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-inventory-reorder', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceInventoryReorderAgent({ adapter: model({ title: 'Inventory Reorder', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-inventory-reorder')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceInventoryReorderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
