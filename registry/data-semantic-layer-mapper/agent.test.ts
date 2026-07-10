import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataSemanticLayerMapperAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_layer_mapper', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-semantic-layer-mapper', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataSemanticLayerMapperAgent({ adapter: model({ title: 'Semantic Layer Mapper', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-semantic-layer-mapper')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataSemanticLayerMapperAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
