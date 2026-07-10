import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechInsuranceClaimTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_claim_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-insurance-claim-triage', () => {
  it('returns typed output', async () => {
    const r = await createFintechInsuranceClaimTriageAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for fintech-insurance-claim-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createFintechInsuranceClaimTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
