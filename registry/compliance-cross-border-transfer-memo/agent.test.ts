import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceCrossBorderTransferMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_transfer_memo', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('compliance-cross-border-transfer-memo', () => {
  it('returns typed v1 output', async () => {
    const r = await createComplianceCrossBorderTransferMemoAgent({ adapter: model({ score: 42, band: 'medium', factors: ['f1'], rationale: 'r', gaps: [] }) }).run('sample input for compliance-cross-border-transfer-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBeGreaterThanOrEqual(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createComplianceCrossBorderTransferMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
