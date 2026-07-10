import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createContentFactCheckerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_fact_checker', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('content-fact-checker', () => {
  it('returns typed v1 output', async () => {
    const r = await createContentFactCheckerAgent({ adapter: model({ title: 'Fact Checker', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for content-fact-checker')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createContentFactCheckerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
