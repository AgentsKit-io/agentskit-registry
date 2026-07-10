import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencyCreativeQaChecklistAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_qa_checklist', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('agency-creative-qa-checklist', () => {
  it('returns typed v1 output', async () => {
    const r = await createAgencyCreativeQaChecklistAgent({ adapter: model({ summary: 'ok', items: [{ item: 'a', pass: true, notes: 'ok' }], gaps: [] }) }).run('sample input for agency-creative-qa-checklist')
    expect(r.requiresReview).toBe(true)
    expect(r.items.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createAgencyCreativeQaChecklistAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
