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
  it('returns typed scan report', async () => {
    const r = await createEcosystemDocBridgeCorpusScannerAgent({
      adapter: model({
        summary: '2 paths',
        scannedPaths: [
          { path: 'packages/auth.md', docType: 'agent-doc', staleness: 'fresh' },
          { path: 'docs/guide.md', docType: 'human-doc', staleness: 'unknown' },
        ],
        gaps: [],
        openQuestions: [],
      }),
    }).run('packages/auth.md and docs/guide.md in corpus')
    expect(r.scannedPaths).toHaveLength(2)
    expect(r.scannedPaths[0].docType).toBe('agent-doc')
    expect(r.requiresReview).toBe(true)
  })

  it('drops invented paths via safety net', async () => {
    const r = await createEcosystemDocBridgeCorpusScannerAgent({
      adapter: model({
        summary: 'scan',
        scannedPaths: [
          { path: 'packages/auth.md', docType: 'agent-doc', staleness: 'fresh' },
          { path: 'packages/phantom.md', docType: 'agent-doc', staleness: 'fresh' },
        ],
        gaps: [],
        openQuestions: [],
      }),
    }).run('only packages/auth.md listed')
    expect(r.scannedPaths).toHaveLength(1)
    expect(r.scannedPaths[0].path).toBe('packages/auth.md')
    expect(r.gaps.some((g) => /dropped/i.test(g))).toBe(true)
  })

  it('flags missing paths in thin input', async () => {
    const r = await createEcosystemDocBridgeCorpusScannerAgent({
      adapter: model({ summary: 'empty', scannedPaths: [], gaps: [], openQuestions: [] }),
    }).run('no markdown files here')
    expect(r.gaps.some((g) => /no .md/i.test(g))).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemDocBridgeCorpusScannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})