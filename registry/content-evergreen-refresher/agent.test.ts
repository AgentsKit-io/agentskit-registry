import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentEvergreenRefresherAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_evergreen_refresher', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-evergreen-refresher', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentEvergreenRefresherAgent({ adapter: model({ title: 'plan', steps: [{ order: 1, action: 'step' }], risks: [], gaps: [], openQuestions: [] }) }).run('sample input for content-evergreen-refresher')
    expect(r.requiresReview).toBe(true)
    expect(r.steps.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentEvergreenRefresherAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
