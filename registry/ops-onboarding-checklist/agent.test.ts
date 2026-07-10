import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsOnboardingChecklistAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_onboarding_checklist', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ops-onboarding-checklist', () => {
  it('returns typed v1 output', async () => {
    const r = await createOpsOnboardingChecklistAgent({ adapter: model({ summary: 'ok', items: [{ item: 'a', pass: true, notes: 'ok' }], gaps: [] }) }).run('sample input for ops-onboarding-checklist')
    expect(r.requiresReview).toBe(true)
    expect(r.items.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createOpsOnboardingChecklistAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
