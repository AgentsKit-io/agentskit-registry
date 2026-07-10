import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechPortfolioRiskDigestAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_risk_digest', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-portfolio-risk-digest', () => {
  it('returns typed output', async () => {
    const r = await createFintechPortfolioRiskDigestAgent({ adapter: model({"score":50,"band":"medium","factors":["f"],"rationale":"r","gaps":[]}) }).run('sample input for fintech-portfolio-risk-digest')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBe(50)
  })

  it('refuses empty input', async () => {
    await expect(createFintechPortfolioRiskDigestAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
