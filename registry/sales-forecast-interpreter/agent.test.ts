import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesForecastInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_forecast_interpreter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-forecast-interpreter', () => {
  it('returns typed output', async () => {
    const r = await createSalesForecastInterpreterAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-forecast-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesForecastInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
