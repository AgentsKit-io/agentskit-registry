import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataDashboardSpecAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_spec_author', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-dashboard-spec-author', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataDashboardSpecAuthorAgent({ adapter: model({ title: 'Dashboard Spec Author', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-dashboard-spec-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataDashboardSpecAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
