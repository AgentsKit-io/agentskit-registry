import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingDatabaseQueryReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_query_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-database-query-reviewer', () => {
  it('returns typed SQL findings', async () => {
    const r = await createCodingDatabaseQueryReviewerAgent({
      adapter: model({
        summary: 'n+1',
        findings: [{ id: 'f1', severity: 'high', pattern: 'n+1', query: 'loop query', message: 'N+1 in loop' }],
        gaps: [],
        openQuestions: [],
      }),
    }).run('users.forEach(u => getOrders(u.id))')
    expect(r.findings[0].pattern).toBe('n+1')
    expect(r.requiresReview).toBe(true)
  })

  it('flags full scan via safety net', async () => {
    const r = await createCodingDatabaseQueryReviewerAgent({
      adapter: model({ summary: 'scan', findings: [], gaps: [], openQuestions: [] }),
    }).run('SELECT * FROM events')
    expect(r.findings.some((f) => f.pattern === 'full-scan')).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createCodingDatabaseQueryReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})