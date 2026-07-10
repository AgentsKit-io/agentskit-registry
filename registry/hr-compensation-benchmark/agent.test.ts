import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrCompensationBenchmarkAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_compensation_benchmark', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-compensation-benchmark', () => {
  it('returns typed output', async () => {
    const r = await createHrCompensationBenchmarkAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-compensation-benchmark')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createHrCompensationBenchmarkAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
