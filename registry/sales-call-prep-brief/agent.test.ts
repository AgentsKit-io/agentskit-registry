import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSalesCallPrepBriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_prep_brief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('sales-call-prep-brief', () => {
  it('returns typed output', async () => {
    const r = await createSalesCallPrepBriefAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for sales-call-prep-brief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createSalesCallPrepBriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
