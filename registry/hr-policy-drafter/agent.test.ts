import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrPolicyDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_drafter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('hr-policy-drafter', () => {
  it('returns typed v1 output', async () => {
    const r = await createHrPolicyDrafterAgent({ adapter: model({ title: 'Policy Drafter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for hr-policy-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createHrPolicyDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
