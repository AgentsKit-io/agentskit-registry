import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityComplianceGapNistAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_gap_nist', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-compliance-gap-nist', () => {
  it('returns typed output', async () => {
    const r = await createSecurityComplianceGapNistAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for security-compliance-gap-nist')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSecurityComplianceGapNistAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
