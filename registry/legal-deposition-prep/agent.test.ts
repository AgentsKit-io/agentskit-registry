import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalDepositionPrepAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_deposition_prep', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('legal-deposition-prep', () => {
  it('returns typed v1 output', async () => {
    const r = await createLegalDepositionPrepAgent({ adapter: model({ title: 'Deposition Prep', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for legal-deposition-prep')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createLegalDepositionPrepAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
