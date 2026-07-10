import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsDeployRiskReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_risk_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-deploy-risk-reviewer', () => {
  it('returns typed output', async () => {
    const r = await createDevopsDeployRiskReviewerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-deploy-risk-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDevopsDeployRiskReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
