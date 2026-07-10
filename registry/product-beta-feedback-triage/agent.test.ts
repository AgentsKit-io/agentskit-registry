import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductBetaFeedbackTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_feedback_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-beta-feedback-triage', () => {
  it('returns typed output', async () => {
    const r = await createProductBetaFeedbackTriageAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for product-beta-feedback-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createProductBetaFeedbackTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
