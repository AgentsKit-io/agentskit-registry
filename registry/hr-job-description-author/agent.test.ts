import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createHrJobDescriptionAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_description_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('hr-job-description-author', () => {
  it('returns typed output', async () => {
    const r = await createHrJobDescriptionAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for hr-job-description-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createHrJobDescriptionAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
