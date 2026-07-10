import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchIndustryBenchmarkAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_industry_benchmark', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('research-industry-benchmark', () => {
  it('returns typed v1 output', async () => {
    const r = await createResearchIndustryBenchmarkAgent({ adapter: model({ title: 'Industry Benchmark', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for research-industry-benchmark')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createResearchIndustryBenchmarkAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
