import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createComplianceCrossBorderTransferMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_transfer_memo', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('compliance-cross-border-transfer-memo', () => {
  it('returns typed output', async () => {
    const r = await createComplianceCrossBorderTransferMemoAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for compliance-cross-border-transfer-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createComplianceCrossBorderTransferMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
