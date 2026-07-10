import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateInspectionReportSummarizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_report_summarizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('realestate-inspection-report-summarizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createRealestateInspectionReportSummarizerAgent({ adapter: model({ title: 'Inspection Summarizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for realestate-inspection-report-summarizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createRealestateInspectionReportSummarizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
