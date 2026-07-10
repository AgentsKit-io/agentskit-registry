import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingBrandComplianceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_brand_compliance', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('marketing-brand-compliance', () => {
  it('returns typed v1 output', async () => {
    const r = await createMarketingBrandComplianceAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for marketing-brand-compliance')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createMarketingBrandComplianceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
