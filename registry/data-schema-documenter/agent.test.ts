import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataSchemaDocumenterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_schema_documenter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('data-schema-documenter', () => {
  it('returns typed v1 output', async () => {
    const r = await createDataSchemaDocumenterAgent({ adapter: model({ title: 'Schema Documenter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for data-schema-documenter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createDataSchemaDocumenterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
