import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataFeatureStoreDocumenterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_store_documenter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-feature-store-documenter', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataFeatureStoreDocumenterAgent({ adapter: model({ title: 'Feature Store Documenter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-feature-store-documenter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataFeatureStoreDocumenterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
