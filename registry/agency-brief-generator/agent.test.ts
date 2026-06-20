import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createBriefGeneratorAgent } from './agent'

const FULL = {
  clientAndProduct: 'Acme — running shoes',
  audience: 'urban runners 25-40',
  keyInsight: 'runners distrust hype',
  singleMindedProposition: 'proven, not promised',
  mandatories: ['logo on final frame'],
  tone: 'confident, plain',
  deliverables: ['30s film', '3 statics'],
  timeline: 'Q3',
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_brief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-brief-generator', () => {
  it('produces a typed brief, always a draft', async () => {
    const r = await createBriefGeneratorAgent({ adapter: model(FULL) }).run('kickoff notes')
    expect(r.brief.audience).toBe('urban runners 25-40')
    expect(r.brief.deliverables).toContain('30s film')
    expect(r.requiresReview).toBe(true)
    expect(r.toBeConfirmed).toEqual([])
  })

  it('lists fields the notes did not cover as toBeConfirmed', async () => {
    const r = await createBriefGeneratorAgent({ adapter: model({ ...FULL, timeline: 'to be confirmed with the client' }) }).run('thin notes')
    expect(r.toBeConfirmed).toContain('timeline')
  })

  it('refuses empty notes', async () => {
    await expect(createBriefGeneratorAgent({ adapter: model(FULL) }).run('  ')).rejects.toThrow(/kickoff notes/)
  })
})
