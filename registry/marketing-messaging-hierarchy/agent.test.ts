import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingMessagingHierarchyAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_messaging_hierarchy', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('marketing-messaging-hierarchy', () => {
  it('returns typed v1 output', async () => {
    const r = await createMarketingMessagingHierarchyAgent({ adapter: model({ title: 'Messaging Hierarchy', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for marketing-messaging-hierarchy')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createMarketingMessagingHierarchyAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
