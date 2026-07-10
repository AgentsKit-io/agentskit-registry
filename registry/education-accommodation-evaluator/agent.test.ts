import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationAccommodationEvaluatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_accommodation_evaluator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-accommodation-evaluator', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationAccommodationEvaluatorAgent({ adapter: model({ title: 'Accommodation Evaluator', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-accommodation-evaluator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationAccommodationEvaluatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
