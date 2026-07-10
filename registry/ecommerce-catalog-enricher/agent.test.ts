import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceCatalogEnricherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_catalog_enricher', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecommerce-catalog-enricher', () => {
  it('returns typed output', async () => {
    const r = await createEcommerceCatalogEnricherAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ecommerce-catalog-enricher')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEcommerceCatalogEnricherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
