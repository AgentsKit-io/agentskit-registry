import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchEsgReporterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_esg_reporter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('research-esg-reporter', () => {
  it('returns typed v1 output', async () => {
    const r = await createResearchEsgReporterAgent({ adapter: model({ title: 'ESG Reporter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for research-esg-reporter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createResearchEsgReporterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
