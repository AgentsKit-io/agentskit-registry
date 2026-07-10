import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceCatastropheTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_catastrophe_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('insurance-catastrophe-triage', () => {
  it('returns typed output', async () => {
    const r = await createInsuranceCatastropheTriageAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for insurance-catastrophe-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createInsuranceCatastropheTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
