import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createProductivityCalendarConflictResolverAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_conflict_resolver', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('productivity-calendar-conflict-resolver', () => {
  it('returns typed v1 output', async () => {
    const r = await createProductivityCalendarConflictResolverAgent({ adapter: model({ title: 'Calendar Conflict Resolver', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for productivity-calendar-conflict-resolver')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createProductivityCalendarConflictResolverAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
