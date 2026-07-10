import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrInterviewDebriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_interview_debrief', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-interview-debrief', () => {
  it('returns typed output', async () => {
    const r = await createHrInterviewDebriefAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-interview-debrief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createHrInterviewDebriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
