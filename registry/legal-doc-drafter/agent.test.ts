import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDocDrafterAgent } from './agent'

const BASE = {
  document: 'MEMO\n...facts per Record A... [inference] likely waived notice.',
  inferences: [{ text: 'likely waived notice', basis: 'no objection in Record A' }],
  openQuestions: ['confirm notice date with client'],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_draft', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-doc-drafter', () => {
  it('drafts the requested doc type, flags inferences, always a draft', async () => {
    const r = await createDocDrafterAgent({ adapter: model(BASE), docType: 'demand-letter' }).run('approved facts')
    expect(r.docType).toBe('demand-letter')
    expect(r.inferences[0].text).toBe('likely waived notice')
    expect(r.openQuestions).toContain('confirm notice date with client')
    expect(r.requiresAttorneyReview).toBe(true)
  })

  it('defaults to a memo', async () => {
    const r = await createDocDrafterAgent({ adapter: model(BASE) }).run('approved facts')
    expect(r.docType).toBe('memo')
  })

  it('refuses empty facts', async () => {
    await expect(createDocDrafterAgent({ adapter: model(BASE) }).run('  ')).rejects.toThrow(/fact pattern/)
  })
})
