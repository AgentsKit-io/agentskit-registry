import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeHandoffAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_handoff_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

const sampleHandoff = {
  type: 'agent-handoff',
  schemaVersion: 1,
  source: 'doc-bridge index',
  target: { type: 'package', id: 'auth', path: 'packages/auth' },
  startHere: 'packages/auth.md',
  readBeforeEditing: ['AGENTS.md', 'packages/auth.md'],
  editRoots: ['packages/auth'],
  checks: ['npm test'],
  notes: ['session refresh owned by auth package'],
}

describe('ecosystem-doc-bridge-handoff-author', () => {
  it('returns typed AgentHandoff v1', async () => {
    const r = await createEcosystemDocBridgeHandoffAuthorAgent({
      adapter: model({ handoff: sampleHandoff, gaps: [], openQuestions: [] }),
    }).run('package auth owns session refresh. editRoot packages/auth')
    expect(r.handoff?.type).toBe('agent-handoff')
    expect(r.handoff?.target.id).toBe('auth')
    expect(r.requiresReview).toBe(true)
  })

  it('returns gaps when handoff is null', async () => {
    const r = await createEcosystemDocBridgeHandoffAuthorAgent({
      adapter: model({ handoff: null, gaps: ['target package id'], openQuestions: [] }),
    }).run('unclear context')
    expect(r.handoff).toBeNull()
    expect(r.gaps.length).toBeGreaterThan(0)
  })

  it('strips humanDoc when not evidenced in input', async () => {
    const r = await createEcosystemDocBridgeHandoffAuthorAgent({
      adapter: model({
        handoff: { ...sampleHandoff, humanDoc: 'docs/auth.md' },
        gaps: [],
        openQuestions: [],
      }),
    }).run('package auth only — no human adapter mentioned')
    expect(r.handoff?.humanDoc).toBeNull()
    expect(r.gaps.some((g) => /humanDoc/i.test(g))).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemDocBridgeHandoffAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})