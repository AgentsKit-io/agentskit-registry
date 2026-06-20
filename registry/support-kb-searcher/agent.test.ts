import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createKbSearcherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_results', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

const HIT = { title: 'Rotating API keys', url: 'https://docs.acme.io/keys/rotate', quote: 'Rotating revokes the old key immediately.', confidence: 5 }

describe('support-kb-searcher', () => {
  it('returns typed hits sorted by confidence', async () => {
    const r = await createKbSearcherAgent({
      adapter: model({ hits: [{ ...HIT, confidence: 3 }, { ...HIT, title: 'Webhooks', url: 'https://docs.acme.io/webhooks', confidence: 5 }], noMatch: false }),
    }).run('How do I rotate my API key?')
    expect(r.noMatch).toBe(false)
    expect(r.hits[0].confidence).toBe(5)
    expect(r.hits[0].title).toBe('Webhooks')
  })

  it('reports noMatch + a suggested topic when nothing matches', async () => {
    const r = await createKbSearcherAgent({ adapter: model({ hits: [], noMatch: true, suggestedTopic: 'ERP integration' }) }).run('integrate with our in-house ERP')
    expect(r.noMatch).toBe(true)
    expect(r.suggestedTopic).toBe('ERP integration')
  })

  it('drops any hit whose URL is not in the retrieved candidate set (no invented articles)', async () => {
    const r = await createKbSearcherAgent({
      retrieve: () => [{ title: 'Rotating API keys', url: 'https://docs.acme.io/keys/rotate', snippet: '...' }],
      adapter: model({ hits: [HIT, { ...HIT, title: 'Made up', url: 'https://docs.acme.io/invented', confidence: 5 }], noMatch: false }),
    }).run('rotate key')
    expect(r.hits).toHaveLength(1)
    expect(r.hits[0].url).toBe('https://docs.acme.io/keys/rotate')
  })

  it('refuses an empty ticket', async () => {
    await expect(createKbSearcherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/ticket/)
  })
})
