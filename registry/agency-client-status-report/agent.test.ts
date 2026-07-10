import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencyClientStatusReportAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_status_report', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-client-status-report', () => {
  it('returns typed output', async () => {
    const r = await createAgencyClientStatusReportAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for agency-client-status-report')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createAgencyClientStatusReportAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
