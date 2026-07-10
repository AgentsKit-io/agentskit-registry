import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentRepurposeMatrixAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_repurpose_matrix', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('content-repurpose-matrix', () => {
  it('returns typed output', async () => {
    const r = await createContentRepurposeMatrixAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for content-repurpose-matrix')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createContentRepurposeMatrixAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
