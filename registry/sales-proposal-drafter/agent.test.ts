import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesProposalDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_proposal_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-proposal-drafter', () => {
  it('returns typed output', async () => {
    const r = await createSalesProposalDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-proposal-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesProposalDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
