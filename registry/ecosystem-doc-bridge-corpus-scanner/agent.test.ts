import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemDocBridgeCorpusScannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_corpus_scanner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-doc-bridge-corpus-scanner', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemDocBridgeCorpusScannerAgent({ adapter: model({"category":"general","severity":"low","queue":"default","rationale":"ok","gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-doc-bridge-corpus-scanner')
    expect(r.requiresReview).toBe(true)
    expect(r.severity).toBe('low')
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemDocBridgeCorpusScannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
