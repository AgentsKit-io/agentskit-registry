import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingObservabilityGapAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_observability_gap', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-observability-gap', () => {
  it('returns typed output', async () => {
    const r = await createCodingObservabilityGapAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-observability-gap')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingObservabilityGapAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
