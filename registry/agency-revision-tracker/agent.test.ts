import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencyRevisionTrackerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_revision_tracker', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('agency-revision-tracker', () => {
  it('returns typed output', async () => {
    const r = await createAgencyRevisionTrackerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for agency-revision-tracker')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createAgencyRevisionTrackerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
