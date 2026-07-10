import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSecurityVulnPrioritizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_vuln_prioritizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('security-vuln-prioritizer', () => {
  it('returns typed output', async () => {
    const r = await createSecurityVulnPrioritizerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for security-vuln-prioritizer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSecurityVulnPrioritizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
