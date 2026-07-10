import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductNpsAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_nps_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-nps-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createProductNpsAnalyzerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-nps-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductNpsAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
