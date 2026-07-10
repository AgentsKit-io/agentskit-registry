import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentTranslationLocalizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_translation_localizer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-translation-localizer', () => {
  it('returns typed output', async () => {
    const r = await createContentTranslationLocalizerAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for content-translation-localizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createContentTranslationLocalizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
