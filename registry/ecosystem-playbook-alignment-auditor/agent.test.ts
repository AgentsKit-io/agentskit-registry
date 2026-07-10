import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemPlaybookAlignmentAuditorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_alignment_auditor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-playbook-alignment-auditor', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemPlaybookAlignmentAuditorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-playbook-alignment-auditor')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemPlaybookAlignmentAuditorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
