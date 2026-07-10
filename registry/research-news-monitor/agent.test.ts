import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchNewsMonitorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_news_monitor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('research-news-monitor', () => {
  it('returns typed output', async () => {
    const r = await createResearchNewsMonitorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for research-news-monitor')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createResearchNewsMonitorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
