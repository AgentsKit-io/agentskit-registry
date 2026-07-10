import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataLineageTracerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_lineage_tracer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-lineage-tracer', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataLineageTracerAgent({ adapter: model({ title: 'Lineage Tracer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-lineage-tracer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataLineageTracerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
