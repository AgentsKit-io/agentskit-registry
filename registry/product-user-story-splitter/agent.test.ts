import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductUserStorySplitterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_story_splitter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-user-story-splitter', () => {
  it('returns typed output', async () => {
    const r = await createProductUserStorySplitterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-user-story-splitter')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductUserStorySplitterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
