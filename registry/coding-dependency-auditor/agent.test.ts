import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingDependencyAuditorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_dependency_auditor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-dependency-auditor', () => {
  it('returns typed output', async () => {
    const r = await createCodingDependencyAuditorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-dependency-auditor')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingDependencyAuditorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
