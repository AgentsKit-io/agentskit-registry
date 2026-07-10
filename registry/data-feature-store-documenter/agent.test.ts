import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataFeatureStoreDocumenterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_store_documenter', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-feature-store-documenter', () => {
  it('returns typed output', async () => {
    const r = await createDataFeatureStoreDocumenterAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for data-feature-store-documenter')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDataFeatureStoreDocumenterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
