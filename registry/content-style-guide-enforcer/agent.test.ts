import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentStyleGuideEnforcerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_guide_enforcer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-style-guide-enforcer', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentStyleGuideEnforcerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for content-style-guide-enforcer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentStyleGuideEnforcerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
