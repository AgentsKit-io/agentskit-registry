import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createPrdAuthorAgent } from './agent'

const FULL = {
  problem: 'users cannot reset passwords',
  users: ['end users'],
  criteria: ['reset email sent within 1m', 'link expires in 1h', 'old password rejected after reset'],
  outOfScope: ['SSO'],
  openQuestions: ['rate limit?'],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_prd', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-prd-author', () => {
  it('produces a typed PRD, always a draft', async () => {
    const r = await createPrdAuthorAgent({ adapter: model(FULL) }).run('let users reset passwords')
    expect(r.prd.criteria.length).toBeGreaterThanOrEqual(3)
    expect(r.prd.openQuestions).toContain('rate limit?')
    expect(r.requiresReview).toBe(true)
  })

  it('refuses an empty description', async () => {
    await expect(createPrdAuthorAgent({ adapter: model(FULL) }).run('  ')).rejects.toThrow(/product description/)
  })
})
