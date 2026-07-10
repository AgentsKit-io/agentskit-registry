import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createOpsSopGeneratorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_sop_generator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ops-sop-generator', () => {
  it('returns typed output', async () => {
    const r = await createOpsSopGeneratorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for ops-sop-generator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createOpsSopGeneratorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
