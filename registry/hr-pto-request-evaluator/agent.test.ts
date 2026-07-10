import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrPtoRequestEvaluatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_request_evaluator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-pto-request-evaluator', () => {
  it('returns typed output', async () => {
    const r = await createHrPtoRequestEvaluatorAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for hr-pto-request-evaluator')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createHrPtoRequestEvaluatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
