import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEscalationDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_draft', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

const BASE = {
  customerImpact: 'CSV exports missing 3 columns since the v4.2 release.',
  whatWeTried: 'Cleared cache, re-ran export, checked column config — all fine on our side.',
  whatWeNeed: 'Engineering to investigate the v4.2 export changes.',
  need: 'engineering-investigation',
  suggestedSla: '48h — customer has a board meeting Friday.',
}

describe('support-escalation-drafter', () => {
  it('returns a typed draft, always for agent review', async () => {
    const r = await createEscalationDrafterAgent({ adapter: model(BASE) }).run('Ticket + notes...')
    expect(r.draft.need).toBe('engineering-investigation')
    expect(r.draft.suggestedSla).toMatch(/48h/)
    expect(r.requiresAgentReview).toBe(true)
  })

  it('deterministically strips raw PII the model leaked into the draft', async () => {
    const leaky = { ...BASE, customerImpact: 'Customer maria.gonzalez@globex.com (call +1-415-555-0199) reports missing columns.' }
    const r = await createEscalationDrafterAgent({ adapter: model(leaky) }).run('Ticket + notes...')
    expect(r.piiStripped).toBeGreaterThan(0)
    expect(r.draft.customerImpact).not.toMatch(/maria\.gonzalez@globex\.com/)
    expect(r.draft.customerImpact).not.toMatch(/\+1-415-555-0199/)
  })

  it('refuses empty input', async () => {
    await expect(createEscalationDrafterAgent({ adapter: model(BASE) }).run('  ')).rejects.toThrow(/escalation drafter/)
  })
})
