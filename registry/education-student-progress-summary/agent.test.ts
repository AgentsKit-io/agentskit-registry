import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationStudentProgressSummaryAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_progress_summary', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-student-progress-summary', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationStudentProgressSummaryAgent({ adapter: model({ title: 'Student Progress Summary', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-student-progress-summary')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationStudentProgressSummaryAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
