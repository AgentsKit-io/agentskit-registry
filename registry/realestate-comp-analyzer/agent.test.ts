import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateCompAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_comp_analyzer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('realestate-comp-analyzer', () => {
  it('returns typed v1 output', async () => {
    const r = await createRealestateCompAnalyzerAgent({ adapter: model({ title: 'Comp Analyzer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for realestate-comp-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createRealestateCompAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
