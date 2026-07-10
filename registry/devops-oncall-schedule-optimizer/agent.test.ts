import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsOncallScheduleOptimizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_schedule_optimizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-oncall-schedule-optimizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsOncallScheduleOptimizerAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for devops-oncall-schedule-optimizer')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsOncallScheduleOptimizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
