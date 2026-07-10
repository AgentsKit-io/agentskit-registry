import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateDisclosureChecklistAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_disclosure_checklist', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('realestate-disclosure-checklist', () => {
  it('returns typed output', async () => {
    const r = await createRealestateDisclosureChecklistAgent({ adapter: model({"summary":"ok","items":[{"item":"a","pass":true,"notes":"ok"}],"gaps":[]}) }).run('sample input for realestate-disclosure-checklist')
    expect(r.requiresReview).toBe(true)
    expect(r.items.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createRealestateDisclosureChecklistAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
