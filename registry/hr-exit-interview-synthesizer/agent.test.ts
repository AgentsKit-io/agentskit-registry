import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrExitInterviewSynthesizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_interview_synthesizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-exit-interview-synthesizer', () => {
  it('returns typed output', async () => {
    const r = await createHrExitInterviewSynthesizerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-exit-interview-synthesizer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrExitInterviewSynthesizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
