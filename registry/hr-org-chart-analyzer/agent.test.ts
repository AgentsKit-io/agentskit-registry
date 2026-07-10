import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrOrgChartAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_chart_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('hr-org-chart-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createHrOrgChartAnalyzerAgent({ adapter: model({ title: 'Org Chart Analyzer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for hr-org-chart-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createHrOrgChartAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
