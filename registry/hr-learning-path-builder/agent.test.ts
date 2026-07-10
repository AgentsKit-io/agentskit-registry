import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrLearningPathBuilderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_path_builder', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-learning-path-builder', () => {
  it('returns typed output', async () => {
    const r = await createHrLearningPathBuilderAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-learning-path-builder')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrLearningPathBuilderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
