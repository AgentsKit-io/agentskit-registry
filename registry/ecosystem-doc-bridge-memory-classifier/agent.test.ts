import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeMemoryClassifierAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_memory_classifier', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-doc-bridge-memory-classifier', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemDocBridgeMemoryClassifierAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-doc-bridge-memory-classifier')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemDocBridgeMemoryClassifierAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
