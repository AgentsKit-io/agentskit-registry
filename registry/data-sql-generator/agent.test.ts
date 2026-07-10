import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataSqlGeneratorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_sql_generator', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-sql-generator', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataSqlGeneratorAgent({ adapter: model({ title: 'SQL Generator', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-sql-generator')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataSqlGeneratorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
