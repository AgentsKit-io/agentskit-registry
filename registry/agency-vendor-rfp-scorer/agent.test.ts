import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencyVendorRfpScorerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_rfp_scorer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-vendor-rfp-scorer', () => {
  it('returns typed output', async () => {
    const r = await createAgencyVendorRfpScorerAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for agency-vendor-rfp-scorer')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createAgencyVendorRfpScorerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
