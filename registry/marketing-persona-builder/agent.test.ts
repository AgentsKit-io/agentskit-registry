import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingPersonaBuilderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_persona_builder', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-persona-builder', () => {
  it('returns typed output', async () => {
    const r = await createMarketingPersonaBuilderAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for marketing-persona-builder')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createMarketingPersonaBuilderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
