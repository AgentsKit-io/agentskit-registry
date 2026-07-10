import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchAcademicSynthesizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_academic_synthesizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-academic-synthesizer', () => {
  it('returns typed output', async () => {
    const r = await createResearchAcademicSynthesizerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for research-academic-synthesizer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createResearchAcademicSynthesizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
