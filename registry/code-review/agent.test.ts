import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodeReviewAgent } from './agent'
import { correctnessLens } from './lenses'

// The mock answers whichever single tool the current runtime offers: lenses offer
// `submit_findings`, skeptics offer `submit_verdict`. One lens keeps it deterministic.
const blockerFinding = {
  findings: [
    { file: 'snippet.ts', line: 1, severity: 'blocker', category: 'correctness', confidence: 0.9, title: 'Null deref', rationale: 'x may be null', suggestion: 'guard it' },
  ],
}

const respond = (verdict: Record<string, unknown>) =>
  mockAdapter({
    response: (req) => {
      const name = req.context?.tools?.[0]?.name ?? ''
      const payload = name === 'submit_findings' ? blockerFinding : verdict
      return [{ type: 'tool_call', toolCall: { id: 't', name, args: JSON.stringify(payload) } }, { type: 'done' }]
    },
  })

describe('code-review agent', () => {
  it('surfaces a verified blocker → REQUEST CHANGES + blocking gate', async () => {
    const agent = createCodeReviewAgent({
      adapter: respond({ refuted: false, reason: 'real bug' }),
      source: { kind: 'stdin', content: 'const x = a.b\n', filename: 'snippet.ts' },
      lenses: [{ key: 'correctness', skill: correctnessLens }],
      auditVotes: 3,
      reporters: [],
    })

    const r = await agent.run()
    expect(r.verdict).toBe('REQUEST CHANGES')
    expect(r.blocking).toBe(true)
    expect(r.findings).toHaveLength(1)
    expect(r.findings[0]?.category).toBe('correctness')
  })

  it('adversarial verify kills a refuted finding → APPROVE, nothing surfaced', async () => {
    const agent = createCodeReviewAgent({
      adapter: respond({ refuted: true, reason: 'false positive' }),
      source: { kind: 'stdin', content: 'const x = a.b\n', filename: 'snippet.ts' },
      lenses: [{ key: 'correctness', skill: correctnessLens }],
      auditVotes: 3,
      reporters: [],
    })

    const r = await agent.run()
    expect(r.verdict).toBe('APPROVE')
    expect(r.findings).toHaveLength(0)
    expect(r.dropped).toHaveLength(1)
  })
})
