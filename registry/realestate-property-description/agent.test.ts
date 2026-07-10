import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestatePropertyDescriptionAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_property_description', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('realestate-property-description', () => {
  it('returns typed v1 output', async () => {
    const r = await createRealestatePropertyDescriptionAgent({ adapter: model({ title: 'Property Description', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for realestate-property-description')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createRealestatePropertyDescriptionAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
