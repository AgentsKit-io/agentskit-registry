import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportRefundEvaluatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_refund_evaluator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('support-refund-evaluator', () => {
  it('returns typed v1 output', async () => {
    const r = await createSupportRefundEvaluatorAgent({ adapter: model({ title: 'Refund Evaluator', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for support-refund-evaluator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSupportRefundEvaluatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
