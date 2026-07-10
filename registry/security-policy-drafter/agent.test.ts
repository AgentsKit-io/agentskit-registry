import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityPolicyDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-policy-drafter', () => {
  it('returns typed output', async () => {
    const r = await createSecurityPolicyDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for security-policy-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSecurityPolicyDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
