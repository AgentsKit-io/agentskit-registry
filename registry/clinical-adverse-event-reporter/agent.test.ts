import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalAdverseEventReporterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_event_reporter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-adverse-event-reporter', () => {
  it('returns typed output', async () => {
    const r = await createClinicalAdverseEventReporterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for clinical-adverse-event-reporter')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createClinicalAdverseEventReporterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
