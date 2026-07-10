import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataAnomalyExplainerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_anomaly_explainer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-anomaly-explainer', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataAnomalyExplainerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for data-anomaly-explainer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataAnomalyExplainerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
