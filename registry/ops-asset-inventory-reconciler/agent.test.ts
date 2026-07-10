import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsAssetInventoryReconcilerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_inventory_reconciler', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ops-asset-inventory-reconciler', () => {
  it('returns typed v1 output', async () => {
    const r = await createOpsAssetInventoryReconcilerAgent({ adapter: model({ title: 'Asset Inventory Reconciler', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ops-asset-inventory-reconciler')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createOpsAssetInventoryReconcilerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
