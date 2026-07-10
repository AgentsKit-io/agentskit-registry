import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingMetaAdCopyAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_ad_copy', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('marketing-meta-ad-copy', () => {
  it('returns typed v1 output', async () => {
    const r = await createMarketingMetaAdCopyAgent({ adapter: model({ title: 'Meta Ad Copy', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for marketing-meta-ad-copy')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createMarketingMetaAdCopyAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
