import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceCoverageGapAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_coverage_gap', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-coverage-gap', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceCoverageGapAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-coverage-gap')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceCoverageGapAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
