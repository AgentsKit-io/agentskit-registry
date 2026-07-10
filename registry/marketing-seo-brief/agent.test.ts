import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingSeoBriefAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_seo_brief', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('marketing-seo-brief', () => {
  it('returns typed v1 output', async () => {
    const r = await createMarketingSeoBriefAgent({ adapter: model({ title: 'SEO Brief', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for marketing-seo-brief')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createMarketingSeoBriefAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
