import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateTenantScreeningMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_screening_memo', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('realestate-tenant-screening-memo', () => {
  it('returns typed v1 output', async () => {
    const r = await createRealestateTenantScreeningMemoAgent({ adapter: model({ category: 'general', severity: 'low', queue: 'default', rationale: 'ok', gaps: [], openQuestions: [] }) }).run('sample input for realestate-tenant-screening-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })
  it('escalates critical red flags', async () => {
    const r = await createRealestateTenantScreeningMemoAgent({ adapter: model({ category: 'x', severity: 'low', queue: 'q', rationale: 'm', gaps: [], openQuestions: [] }) }).run('full outage for all users')
    expect(r.severity).toBe('critical')
  })
  it('refuses empty input', async () => {
    await expect(createRealestateTenantScreeningMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
