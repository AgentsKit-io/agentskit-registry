import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentGlossaryBuilderAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_glossary_builder', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-glossary-builder', () => {
  it('returns typed output', async () => {
    const r = await createContentGlossaryBuilderAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for content-glossary-builder')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createContentGlossaryBuilderAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
