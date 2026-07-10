import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductExperimentDesignerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_experiment_designer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('product-experiment-designer', () => {
  it('returns typed output', async () => {
    const r = await createProductExperimentDesignerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for product-experiment-designer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createProductExperimentDesignerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
