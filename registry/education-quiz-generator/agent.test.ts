import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationQuizGeneratorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_quiz_generator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('education-quiz-generator', () => {
  it('returns typed output', async () => {
    const r = await createEducationQuizGeneratorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for education-quiz-generator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEducationQuizGeneratorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
