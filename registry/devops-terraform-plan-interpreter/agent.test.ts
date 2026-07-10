import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsTerraformPlanInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_plan_interpreter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-terraform-plan-interpreter', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsTerraformPlanInterpreterAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for devops-terraform-plan-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsTerraformPlanInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
