import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataEtlFailureDiagnoserAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_failure_diagnoser', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-etl-failure-diagnoser', () => {
  it('returns typed output', async () => {
    const r = await createDataEtlFailureDiagnoserAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for data-etl-failure-diagnoser')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDataEtlFailureDiagnoserAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
