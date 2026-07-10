import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateCmaAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_cma_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('realestate-cma-author', () => {
  it('returns typed output', async () => {
    const r = await createRealestateCmaAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for realestate-cma-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createRealestateCmaAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
