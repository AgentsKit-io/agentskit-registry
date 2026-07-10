import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsMeetingActionExtractorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_action_extractor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-meeting-action-extractor', () => {
  it('returns typed output', async () => {
    const r = await createOpsMeetingActionExtractorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-meeting-action-extractor')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createOpsMeetingActionExtractorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
