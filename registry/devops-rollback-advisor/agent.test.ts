import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsRollbackAdvisorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_rollback_advisor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-rollback-advisor', () => {
  it('returns typed output', async () => {
    const r = await createDevopsRollbackAdvisorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-rollback-advisor')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDevopsRollbackAdvisorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
