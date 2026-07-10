import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentInternalLinkPlannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_link_planner', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-internal-link-planner', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentInternalLinkPlannerAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for content-internal-link-planner')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentInternalLinkPlannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
