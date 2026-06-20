import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDeckBuilderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_deck', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-deck-builder', () => {
  it('returns typed slides, always a draft', async () => {
    const r = await createDeckBuilderAgent({ adapter: model({ slides: [{ section: 'what worked', bullets: ['CTR up 18%'], citations: ['KPI sheet'] }] }) }).run('artifacts')
    expect(r.deck[0].section).toBe('what worked')
    expect(r.requiresReview).toBe(true)
    expect(r.uncitedMetrics).toEqual([])
  })

  it('flags a slide that quotes a number with no citation', async () => {
    const r = await createDeckBuilderAgent({ adapter: model({ slides: [{ section: 'results', bullets: ['revenue up 40%'], citations: [] }] }) }).run('artifacts')
    expect(r.uncitedMetrics).toContain('results')
  })

  it('does not flag a "data to be confirmed" bullet as uncited', async () => {
    const r = await createDeckBuilderAgent({ adapter: model({ slides: [{ section: 'next', bullets: ['Q4 target: data to be confirmed'], citations: [] }] }) }).run('artifacts')
    expect(r.uncitedMetrics).toEqual([])
  })

  it('refuses empty artifacts', async () => {
    await expect(createDeckBuilderAgent({ adapter: model({ slides: [] }) }).run('  ')).rejects.toThrow(/artifacts/)
  })
})
