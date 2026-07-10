import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalPriorAuthPackAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_auth_pack', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-prior-auth-pack', () => {
  it('returns typed output', async () => {
    const r = await createClinicalPriorAuthPackAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for clinical-prior-auth-pack')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createClinicalPriorAuthPackAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
