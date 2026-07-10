import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchVendorEvaluationAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_vendor_evaluation', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-vendor-evaluation', () => {
  it('returns typed output', async () => {
    const r = await createResearchVendorEvaluationAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for research-vendor-evaluation')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createResearchVendorEvaluationAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
