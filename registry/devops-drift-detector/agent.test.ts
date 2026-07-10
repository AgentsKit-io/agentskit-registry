import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsDriftDetectorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_drift_detector', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-drift-detector', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsDriftDetectorAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for devops-drift-detector')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsDriftDetectorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
