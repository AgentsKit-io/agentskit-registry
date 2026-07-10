import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalRegulatoryFilingDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_filing_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-regulatory-filing-drafter', () => {
  it('returns typed output', async () => {
    const r = await createLegalRegulatoryFilingDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-regulatory-filing-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createLegalRegulatoryFilingDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
