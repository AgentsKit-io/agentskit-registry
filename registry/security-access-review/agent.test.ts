import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityAccessReviewAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_access_review', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('security-access-review', () => {
  it('returns typed v1 output', async () => {
    const r = await createSecurityAccessReviewAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for security-access-review')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSecurityAccessReviewAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
