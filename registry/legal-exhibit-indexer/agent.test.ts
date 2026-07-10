import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalExhibitIndexerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_exhibit_indexer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-exhibit-indexer', () => {
  it('returns typed output', async () => {
    const r = await createLegalExhibitIndexerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-exhibit-indexer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalExhibitIndexerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
