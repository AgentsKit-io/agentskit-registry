import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductPrioritizationRiceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_prioritization_rice', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('product-prioritization-rice', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductPrioritizationRiceAgent({ adapter: model({ score: 42, band: 'medium', factors: ['f1'], rationale: 'r', gaps: [] }) }).run('sample input for product-prioritization-rice')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBeGreaterThanOrEqual(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductPrioritizationRiceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
