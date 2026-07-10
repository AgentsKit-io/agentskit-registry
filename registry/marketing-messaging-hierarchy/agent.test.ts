import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingMessagingHierarchyAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_messaging_hierarchy', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('marketing-messaging-hierarchy', () => {
  it('returns typed output', async () => {
    const r = await createMarketingMessagingHierarchyAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for marketing-messaging-hierarchy')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createMarketingMessagingHierarchyAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
