import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductMetricsTreeAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_tree_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-metrics-tree-author', () => {
  it('returns typed output', async () => {
    const r = await createProductMetricsTreeAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for product-metrics-tree-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createProductMetricsTreeAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
