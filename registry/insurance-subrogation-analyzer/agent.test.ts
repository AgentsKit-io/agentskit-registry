import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceSubrogationAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_subrogation_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('insurance-subrogation-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createInsuranceSubrogationAnalyzerAgent({ adapter: model({ title: 'Subrogation Analyzer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for insurance-subrogation-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createInsuranceSubrogationAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
