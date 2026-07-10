import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsAssetInventoryReconcilerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_inventory_reconciler', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-asset-inventory-reconciler', () => {
  it('returns typed output', async () => {
    const r = await createOpsAssetInventoryReconcilerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-asset-inventory-reconciler')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createOpsAssetInventoryReconcilerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
