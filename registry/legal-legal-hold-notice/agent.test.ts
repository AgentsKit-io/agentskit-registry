import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalLegalHoldNoticeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_hold_notice', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-legal-hold-notice', () => {
  it('returns typed output', async () => {
    const r = await createLegalLegalHoldNoticeAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for legal-legal-hold-notice')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createLegalLegalHoldNoticeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
