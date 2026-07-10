import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsPostmortemActionTrackerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_action_tracker', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-postmortem-action-tracker', () => {
  it('returns typed output', async () => {
    const r = await createOpsPostmortemActionTrackerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-postmortem-action-tracker')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createOpsPostmortemActionTrackerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
