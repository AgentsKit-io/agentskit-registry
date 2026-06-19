import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createNoteSummariserAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_note', args: JSON.stringify({ subjective: '', objective: '', assessment: '', plan: '', missingFields: [], ...payload }) } },
      { type: 'done' },
    ],
  })

describe('clinical-note-summariser', () => {
  it('produces a typed SOAP note and is always a draft', async () => {
    const r = await createNoteSummariserAgent({ adapter: model({ subjective: 'cough', objective: 'T 38', assessment: 'URI', plan: 'fluids' }) }).run('dictation')
    expect(r.note.assessment).toBe('URI')
    expect(r.note.plan).toBe('fluids')
    expect(r.requiresClinicianSignoff).toBe(true)
  })

  it('surfaces missing sections instead of inventing them', async () => {
    const r = await createNoteSummariserAgent({ adapter: model({ subjective: 'cough', missingFields: ['plan', 'objective'] }) }).run('partial dictation')
    expect(r.missingFields).toContain('plan')
    expect(r.note.plan).toBe('')
  })

  it('refuses empty dictation', async () => {
    await expect(createNoteSummariserAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/dictation/)
  })
})
