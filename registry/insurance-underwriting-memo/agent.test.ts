import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createInsuranceUnderwritingMemoAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_underwriting_memo', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('insurance-underwriting-memo', () => {
  it('returns typed v1 output', async () => {
    const r = await createInsuranceUnderwritingMemoAgent({ adapter: model({ title: 'Underwriting Memo', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for insurance-underwriting-memo')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createInsuranceUnderwritingMemoAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
