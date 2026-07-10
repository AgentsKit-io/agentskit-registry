import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsTerraformPlanInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_plan_interpreter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-terraform-plan-interpreter', () => {
  it('returns typed output', async () => {
    const r = await createDevopsTerraformPlanInterpreterAgent({ adapter: model({"title":"plan","steps":[{"order":1,"action":"step"}],"risks":[],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-terraform-plan-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDevopsTerraformPlanInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
