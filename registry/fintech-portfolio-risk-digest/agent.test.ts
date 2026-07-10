import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechPortfolioRiskDigestAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_risk_digest', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('fintech-portfolio-risk-digest', () => {
  it('returns typed v1 output', async () => {
    const r = await createFintechPortfolioRiskDigestAgent({ adapter: model({ score: 42, band: 'medium', factors: ['f1'], rationale: 'r', gaps: [] }) }).run('sample input for fintech-portfolio-risk-digest')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBeGreaterThanOrEqual(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createFintechPortfolioRiskDigestAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
