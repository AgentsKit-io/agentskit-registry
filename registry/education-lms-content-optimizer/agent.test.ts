import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationLmsContentOptimizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_content_optimizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('education-lms-content-optimizer', () => {
  it('returns typed output', async () => {
    const r = await createEducationLmsContentOptimizerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for education-lms-content-optimizer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEducationLmsContentOptimizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
