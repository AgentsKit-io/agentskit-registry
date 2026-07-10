import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchPatentPriorArtAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_prior_art', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-patent-prior-art', () => {
  it('returns typed output', async () => {
    const r = await createResearchPatentPriorArtAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for research-patent-prior-art')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createResearchPatentPriorArtAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
