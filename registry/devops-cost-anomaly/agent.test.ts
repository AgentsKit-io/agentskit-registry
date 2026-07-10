import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsCostAnomalyAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_cost_anomaly', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-cost-anomaly', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsCostAnomalyAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for devops-cost-anomaly')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsCostAnomalyAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
