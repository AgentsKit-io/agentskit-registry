import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcommerceBundleSuggesterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_bundle_suggester', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecommerce-bundle-suggester', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcommerceBundleSuggesterAgent({ adapter: model({ title: 'Bundle Suggester', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecommerce-bundle-suggester')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcommerceBundleSuggesterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
