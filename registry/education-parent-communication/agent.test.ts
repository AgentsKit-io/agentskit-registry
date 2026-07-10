import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationParentCommunicationAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_parent_communication', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('education-parent-communication', () => {
  it('returns typed output', async () => {
    const r = await createEducationParentCommunicationAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for education-parent-communication')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEducationParentCommunicationAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
