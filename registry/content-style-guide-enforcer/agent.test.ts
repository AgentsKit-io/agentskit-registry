import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentStyleGuideEnforcerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_guide_enforcer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-style-guide-enforcer', () => {
  it('returns typed output', async () => {
    const r = await createContentStyleGuideEnforcerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for content-style-guide-enforcer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createContentStyleGuideEnforcerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
