import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsVendorRenewalTrackerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_renewal_tracker', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ops-vendor-renewal-tracker', () => {
  it('returns typed v1 output', async () => {
    const r = await createOpsVendorRenewalTrackerAgent({ adapter: model({ title: 'Vendor Renewal Tracker', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ops-vendor-renewal-tracker')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createOpsVendorRenewalTrackerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
