import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeMemoryClassifierAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      {
        type: 'tool_call',
        toolCall: { id: '1', name: 'submit_memory_classification', args: JSON.stringify(payload) },
      },
      { type: 'done' },
    ],
  })

describe('ecosystem-doc-bridge-memory-classifier', () => {
  it('returns typed candidates', async () => {
    const r = await createEcosystemDocBridgeMemoryClassifierAgent({
      adapter: model({
        candidates: [{ id: 'c1', fact: 'Auth forwards AbortSignal', route: 'promote', rationale: 'durable convention', safetyFlags: [] }],
        gaps: [],
      }),
    }).run('Auth handlers must forward AbortSignal to fetch calls.')
    expect(r.candidates[0].route).toBe('promote')
    expect(r.requiresReview).toBe(true)
  })

  it('rejects candidates with secret patterns via safety net', async () => {
    const r = await createEcosystemDocBridgeMemoryClassifierAgent({
      adapter: model({
        candidates: [{ id: 'bad', fact: 'api_key=sk-live-abc', route: 'promote', rationale: 'oops', safetyFlags: [] }],
        gaps: [],
      }),
    }).run('api_key=sk-live-abc in our staging notes')
    expect(r.candidates[0].route).toBe('reject')
    expect(r.candidates[0].safetyFlags).toContain('secret-pattern')
  })

  it('rejects private email via safety net', async () => {
    const r = await createEcosystemDocBridgeMemoryClassifierAgent({
      adapter: model({
        candidates: [{ id: 'e1', fact: 'Contact rebeca@company.com for access', route: 'hold', rationale: 'contact', safetyFlags: [] }],
        gaps: [],
      }),
    }).run('Contact rebeca@company.com for access')
    expect(r.candidates[0].route).toBe('reject')
    expect(r.candidates[0].safetyFlags).toContain('private-email')
  })

  it('refuses empty notes', async () => {
    await expect(createEcosystemDocBridgeMemoryClassifierAgent({ adapter: model({}) }).run('  ')).rejects.toThrow(/notes/)
  })
})