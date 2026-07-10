import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataCohortAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_cohort_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-cohort-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createDataCohortAnalyzerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for data-cohort-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDataCohortAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
