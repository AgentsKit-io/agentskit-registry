import { describe, expect, it } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodeReviewAgent } from './agent'
import { correctnessLens } from './lenses'

// The mock answers whichever single tool the current runtime offers: lenses offer
// `submit_findings`, skeptics offer `submit_verdict`. One lens keeps it deterministic.
const finding = (over: Record<string, unknown> = {}) => ({
  findings: [
    { file: 'snippet.ts', line: 1, severity: 'blocker', category: 'correctness', confidence: 0.9, title: 'Null deref', rationale: 'x may be null', suggestion: 'guard it', ...over },
  ],
})

const respond = (opts: { finding?: Record<string, unknown>; verdict?: unknown } = {}) =>
  mockAdapter({
    response: (req) => {
      const name = req.context?.tools?.[0]?.name ?? ''
      const payload = name === 'submit_findings' ? (opts.finding ?? finding()) : (opts.verdict ?? { refuted: false, reason: 'real' })
      return [{ type: 'tool_call', toolCall: { id: 't', name, args: JSON.stringify(payload) } }, { type: 'done' }]
    },
  })

const base = {
  source: { kind: 'stdin' as const, content: 'const x = a.b\n', filename: 'snippet.ts' },
  lenses: [{ key: 'correctness' as const, skill: correctnessLens }],
  reporters: [],
}

describe('code-review agent', () => {
  it('surfaces a verified blocker → REQUEST CHANGES + blocking gate', async () => {
    const r = await createCodeReviewAgent({ ...base, adapter: respond(), auditVotes: 3 }).run()
    expect(r.verdict).toBe('REQUEST CHANGES')
    expect(r.blocking).toBe(true)
    expect(r.findings).toHaveLength(1)
    expect(r.findings[0]?.category).toBe('correctness')
  })

  it('adversarial verify kills a refuted finding → APPROVE', async () => {
    const r = await createCodeReviewAgent({ ...base, adapter: respond({ verdict: { refuted: true, reason: 'fp' } }), auditVotes: 3 }).run()
    expect(r.verdict).toBe('APPROVE')
    expect(r.findings).toHaveLength(0)
    expect(r.dropped).toHaveLength(1)
  })

  it('drops a finding below the confidence threshold', async () => {
    const r = await createCodeReviewAgent({ ...base, adapter: respond({ finding: finding({ confidence: 0.3 }) }), thresholds: { minConfidence: 0.5 } }).run()
    expect(r.verdict).toBe('APPROVE')
    expect(r.findings).toHaveLength(0)
    expect(r.dropped).toHaveLength(1)
  })

  it('blockingSeverity is configurable — a high finding gates when block=high', async () => {
    const r = await createCodeReviewAgent({ ...base, adapter: respond({ finding: finding({ severity: 'high' }) }), blockingSeverity: 'high' }).run()
    expect(r.verdict).toBe('REQUEST CHANGES')
    expect(r.blocking).toBe(true)
  })

  it('a malformed verify vote is ignored, not fatal — finding still evaluated', async () => {
    // verdict payload missing required fields → Zod throws inside verify → caught;
    // with no valid votes the finding survives (thresholds still apply).
    const r = await createCodeReviewAgent({ ...base, adapter: respond({ verdict: { bogus: true } }), auditVotes: 1 }).run()
    expect(r.findings).toHaveLength(1)
    expect(r.verdict).toBe('REQUEST CHANGES')
  })
})
