import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsurancePolicySummarizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_summarizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-policy-summarizer', () => {
  it('returns typed output', async () => {
    const r = await createInsurancePolicySummarizerAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for insurance-policy-summarizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createInsurancePolicySummarizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
