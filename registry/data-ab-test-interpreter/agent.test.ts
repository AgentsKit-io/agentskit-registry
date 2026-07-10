import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataAbTestInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_test_interpreter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-ab-test-interpreter', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataAbTestInterpreterAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for data-ab-test-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataAbTestInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
