import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataSemanticLayerMapperAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_layer_mapper', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-semantic-layer-mapper', () => {
  it('returns typed output', async () => {
    const r = await createDataSemanticLayerMapperAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for data-semantic-layer-mapper')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDataSemanticLayerMapperAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
