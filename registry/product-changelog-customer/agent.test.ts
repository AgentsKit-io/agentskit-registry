import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductChangelogCustomerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_changelog_customer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-changelog-customer', () => {
  it('returns typed output', async () => {
    const r = await createProductChangelogCustomerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-changelog-customer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductChangelogCustomerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
