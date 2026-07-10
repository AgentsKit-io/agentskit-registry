import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsDnsCutoverPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_cutover_planner', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-dns-cutover-planner', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsDnsCutoverPlannerAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for devops-dns-cutover-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsDnsCutoverPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
