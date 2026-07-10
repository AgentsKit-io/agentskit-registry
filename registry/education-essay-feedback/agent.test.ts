import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationEssayFeedbackAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_essay_feedback', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-essay-feedback', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationEssayFeedbackAgent({ adapter: model({ title: 'Essay Feedback', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-essay-feedback')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationEssayFeedbackAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
