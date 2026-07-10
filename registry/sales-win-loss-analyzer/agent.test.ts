import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesWinLossAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_loss_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-win-loss-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createSalesWinLossAnalyzerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-win-loss-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSalesWinLossAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
