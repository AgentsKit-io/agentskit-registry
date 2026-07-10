import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrInterviewQuestionBankAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_question_bank', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-interview-question-bank', () => {
  it('returns typed output', async () => {
    const r = await createHrInterviewQuestionBankAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-interview-question-bank')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrInterviewQuestionBankAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
