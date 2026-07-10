import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsAuditEvidenceCollectorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_evidence_collector', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-audit-evidence-collector', () => {
  it('returns typed output', async () => {
    const r = await createOpsAuditEvidenceCollectorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-audit-evidence-collector')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createOpsAuditEvidenceCollectorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
