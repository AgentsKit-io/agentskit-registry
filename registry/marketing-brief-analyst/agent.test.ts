import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createBriefAnalystAgent } from './agent'

const FULL = {
  clientProduct: 'Acme shoes',
  objective: 'conversion',
  audience: 'urban runners',
  keyMessages: ['proven', 'fast'],
  tone: 'confident',
  channels: ['LinkedIn'],
  timeline: 'Q3',
  mandatories: ['logo end frame'],
  voiceFlags: [],
  gaps: [],
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_brief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-brief-analyst', () => {
  it('returns a typed brief, always a draft', async () => {
    const r = await createBriefAnalystAgent({ adapter: model(FULL) }).run('brief')
    expect(r.brief.objective).toBe('conversion')
    expect(r.brief.keyMessages).toContain('proven')
    expect(r.gaps).toEqual([])
    expect(r.requiresReview).toBe(true)
  })

  it('surfaces gaps rather than guessing missing fields', async () => {
    const r = await createBriefAnalystAgent({ adapter: model({ ...FULL, objective: 'unspecified', gaps: ['objective', 'timeline'] }) }).run('thin brief')
    expect(r.gaps).toContain('objective')
    expect(r.brief.objective).toBe('unspecified')
  })

  it('refuses empty brief', async () => {
    await expect(createBriefAnalystAgent({ adapter: model(FULL) }).run('  ')).rejects.toThrow(/campaign brief/)
  })
})
