import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrSkillsGapAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_gap_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('hr-skills-gap-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createHrSkillsGapAnalyzerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for hr-skills-gap-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createHrSkillsGapAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
