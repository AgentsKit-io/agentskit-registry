import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createClinicalFormularyCheckerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_formulary_checker', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('clinical-formulary-checker', () => {
  it('returns typed output', async () => {
    const r = await createClinicalFormularyCheckerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for clinical-formulary-checker')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createClinicalFormularyCheckerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
