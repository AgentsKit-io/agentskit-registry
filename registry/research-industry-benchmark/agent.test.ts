import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchIndustryBenchmarkAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_industry_benchmark', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-industry-benchmark', () => {
  it('returns typed output', async () => {
    const r = await createResearchIndustryBenchmarkAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for research-industry-benchmark')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createResearchIndustryBenchmarkAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
