import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportMacroSuggesterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_macro_suggester', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('support-macro-suggester', () => {
  it('returns typed output', async () => {
    const r = await createSupportMacroSuggesterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for support-macro-suggester')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createSupportMacroSuggesterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
