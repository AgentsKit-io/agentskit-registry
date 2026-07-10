import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDevopsSloBreachAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_breach_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('devops-slo-breach-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createDevopsSloBreachAnalyzerAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for devops-slo-breach-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createDevopsSloBreachAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
