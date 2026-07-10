import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrComplianceChecklistAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_compliance_checklist', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-compliance-checklist', () => {
  it('returns typed output', async () => {
    const r = await createHrComplianceChecklistAgent({ adapter: model({"summary":"ok","items":[{"item":"a","pass":true,"notes":"ok"}],"gaps":[]}) }).run('sample input for hr-compliance-checklist')
    expect(r.requiresReview).toBe(true)
    expect(r.items.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createHrComplianceChecklistAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
