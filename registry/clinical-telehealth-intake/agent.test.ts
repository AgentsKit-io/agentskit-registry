import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalTelehealthIntakeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_telehealth_intake', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-telehealth-intake', () => {
  it('returns typed output', async () => {
    const r = await createClinicalTelehealthIntakeAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for clinical-telehealth-intake')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createClinicalTelehealthIntakeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
