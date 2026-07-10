import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingOncallHandoffAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_oncall_handoff', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-oncall-handoff', () => {
  it('returns typed output', async () => {
    const r = await createCodingOncallHandoffAgent({ adapter: model({"score":50,"band":"medium","factors":["f"],"rationale":"r","gaps":[]}) }).run('sample input for coding-oncall-handoff')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBe(50)
  })

  it('refuses empty input', async () => {
    await expect(createCodingOncallHandoffAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
