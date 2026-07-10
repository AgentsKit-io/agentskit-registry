import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrResumeScreenerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_resume_screener', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-resume-screener', () => {
  it('returns typed output', async () => {
    const r = await createHrResumeScreenerAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for hr-resume-screener')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createHrResumeScreenerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
