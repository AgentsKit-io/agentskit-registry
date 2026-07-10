import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingI18nReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_i18n_reviewer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('coding-i18n-reviewer', () => {
  it('returns typed v1 output', async () => {
    const r = await createCodingI18nReviewerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for coding-i18n-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createCodingI18nReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
