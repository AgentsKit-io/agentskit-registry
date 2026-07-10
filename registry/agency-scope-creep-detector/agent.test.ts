import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencyScopeCreepDetectorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_creep_detector', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('agency-scope-creep-detector', () => {
  it('returns typed v1 output', async () => {
    const r = await createAgencyScopeCreepDetectorAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for agency-scope-creep-detector')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createAgencyScopeCreepDetectorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
