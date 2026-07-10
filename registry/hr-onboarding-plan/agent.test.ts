import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrOnboardingPlanAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_onboarding_plan', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('hr-onboarding-plan', () => {
  it('returns typed v1 output', async () => {
    const r = await createHrOnboardingPlanAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for hr-onboarding-plan')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createHrOnboardingPlanAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
