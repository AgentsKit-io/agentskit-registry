import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalEdiscoveryPrivilegeLogAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_privilege_log', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-ediscovery-privilege-log', () => {
  it('returns typed output', async () => {
    const r = await createLegalEdiscoveryPrivilegeLogAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-ediscovery-privilege-log')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalEdiscoveryPrivilegeLogAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
