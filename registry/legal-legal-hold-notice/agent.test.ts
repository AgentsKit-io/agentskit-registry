import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalLegalHoldNoticeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_hold_notice', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('legal-legal-hold-notice', () => {
  it('returns typed v1 output', async () => {
    const r = await createLegalLegalHoldNoticeAgent({ adapter: model({ title: 'Legal Hold Notice', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for legal-legal-hold-notice')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createLegalLegalHoldNoticeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
