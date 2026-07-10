import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrCultureSurveyAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_survey_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-culture-survey-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createHrCultureSurveyAnalyzerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-culture-survey-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrCultureSurveyAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
