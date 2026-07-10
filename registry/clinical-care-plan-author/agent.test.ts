import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalCarePlanAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_plan_author', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('clinical-care-plan-author', () => {
  it('returns typed v1 output', async () => {
    const r = await createClinicalCarePlanAuthorAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for clinical-care-plan-author')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createClinicalCarePlanAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
