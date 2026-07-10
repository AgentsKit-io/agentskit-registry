import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsRunbookMatcherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_runbook_matcher', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-runbook-matcher', () => {
  it('returns typed output', async () => {
    const r = await createDevopsRunbookMatcherAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-runbook-matcher')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDevopsRunbookMatcherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
