import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationIepDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_iep_drafter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('education-iep-drafter', () => {
  it('returns typed output', async () => {
    const r = await createEducationIepDrafterAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for education-iep-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEducationIepDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
