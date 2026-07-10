import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataCohortAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_cohort_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-cohort-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataCohortAnalyzerAgent({ adapter: model({ title: 'Cohort Analyzer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-cohort-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataCohortAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
