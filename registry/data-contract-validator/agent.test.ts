import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataContractValidatorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_contract_validator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-contract-validator', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataContractValidatorAgent({ adapter: model({ summary: 'review', findings: [{ id: 'f1', severity: 'medium', message: 'issue' }], gaps: [], openQuestions: [] }) }).run('sample input for data-contract-validator')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataContractValidatorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
