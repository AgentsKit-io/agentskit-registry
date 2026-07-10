import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesWinLossAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_loss_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('sales-win-loss-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createSalesWinLossAnalyzerAgent({ adapter: model({ title: 'Win/Loss Analyzer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for sales-win-loss-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSalesWinLossAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
