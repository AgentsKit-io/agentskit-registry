import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchGrantProposalResearchAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_proposal_research', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('research-grant-proposal-research', () => {
  it('returns typed v1 output', async () => {
    const r = await createResearchGrantProposalResearchAgent({ adapter: model({ title: 'Grant Proposal Research', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for research-grant-proposal-research')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createResearchGrantProposalResearchAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
