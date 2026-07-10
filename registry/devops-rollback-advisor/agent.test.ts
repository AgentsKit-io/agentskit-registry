import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsRollbackAdvisorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_rollback_advisor', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-rollback-advisor', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsRollbackAdvisorAgent({ adapter: model({ title: 'Rollback Advisor', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for devops-rollback-advisor')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsRollbackAdvisorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
