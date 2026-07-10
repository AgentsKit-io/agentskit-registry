import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataMetricDefinerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_metric_definer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-metric-definer', () => {
  it('returns typed output', async () => {
    const r = await createDataMetricDefinerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for data-metric-definer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDataMetricDefinerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
