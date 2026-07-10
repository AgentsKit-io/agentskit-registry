import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsChangeAdvisoryAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_change_advisory', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-change-advisory', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsChangeAdvisoryAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for devops-change-advisory')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsChangeAdvisoryAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
