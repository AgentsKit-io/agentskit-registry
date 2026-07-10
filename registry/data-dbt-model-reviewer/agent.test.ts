import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataDbtModelReviewerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_model_reviewer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-dbt-model-reviewer', () => {
  it('returns typed output', async () => {
    const r = await createDataDbtModelReviewerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for data-dbt-model-reviewer')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDataDbtModelReviewerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
