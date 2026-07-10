import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceCatalogEnricherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_catalog_enricher', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-catalog-enricher', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceCatalogEnricherAgent({ adapter: model({ title: 'Catalog Enricher', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-catalog-enricher')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceCatalogEnricherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
