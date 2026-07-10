import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchPolicyBriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_brief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-policy-brief', () => {
  it('returns typed output', async () => {
    const r = await createResearchPolicyBriefAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for research-policy-brief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createResearchPolicyBriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
