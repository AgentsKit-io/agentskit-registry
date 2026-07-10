import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingLicenseComplianceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_license_compliance', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-license-compliance', () => {
  it('returns typed output', async () => {
    const r = await createCodingLicenseComplianceAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-license-compliance')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createCodingLicenseComplianceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
