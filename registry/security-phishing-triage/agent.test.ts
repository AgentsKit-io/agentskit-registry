import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityPhishingTriageAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_phishing_triage', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-phishing-triage', () => {
  it('returns typed output', async () => {
    const r = await createSecurityPhishingTriageAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for security-phishing-triage')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createSecurityPhishingTriageAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
