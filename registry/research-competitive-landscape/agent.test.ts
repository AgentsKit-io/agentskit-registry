import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createResearchCompetitiveLandscapeAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_competitive_landscape', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('research-competitive-landscape', () => {
  it('returns typed v1 output', async () => {
    const r = await createResearchCompetitiveLandscapeAgent({ adapter: model({ title: 'Competitive Landscape', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for research-competitive-landscape')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createResearchCompetitiveLandscapeAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
