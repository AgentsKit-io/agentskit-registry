import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsSecretsLeakScannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_leak_scanner', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('devops-secrets-leak-scanner', () => {
  it('returns typed v1 output', async () => {
    const r = await createDevopsSecretsLeakScannerAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for devops-secrets-leak-scanner')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDevopsSecretsLeakScannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
