import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceMarketplacePolicyCheckAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_policy_check', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-marketplace-policy-check', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceMarketplacePolicyCheckAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-marketplace-policy-check')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceMarketplacePolicyCheckAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
