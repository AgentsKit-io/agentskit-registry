import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentBlogOutlineAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_blog_outline', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-blog-outline', () => {
  it('returns typed output', async () => {
    const r = await createContentBlogOutlineAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for content-blog-outline')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createContentBlogOutlineAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
