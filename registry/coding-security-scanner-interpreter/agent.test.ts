import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingSecurityScannerInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_scanner_interpreter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-security-scanner-interpreter', () => {
  it('returns typed output', async () => {
    const r = await createCodingSecurityScannerInterpreterAgent({ adapter: model({"summary":"ok","clusters":[{"name":"c1","theme":"t","items":["a"]}],"unassigned":[]}) }).run('sample input for coding-security-scanner-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.clusters.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingSecurityScannerInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
