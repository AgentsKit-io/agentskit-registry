import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingSecurityScannerInterpreterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_scanner_interpreter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('coding-security-scanner-interpreter', () => {
  it('returns typed v1 output', async () => {
    const r = await createCodingSecurityScannerInterpreterAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for coding-security-scanner-interpreter')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createCodingSecurityScannerInterpreterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
