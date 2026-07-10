import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchDueDiligenceAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_due_diligence', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-due-diligence', () => {
  it('returns typed output', async () => {
    const r = await createResearchDueDiligenceAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for research-due-diligence')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createResearchDueDiligenceAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
