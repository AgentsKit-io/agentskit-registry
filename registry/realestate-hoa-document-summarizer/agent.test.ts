import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createRealestateHoaDocumentSummarizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_document_summarizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('realestate-hoa-document-summarizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createRealestateHoaDocumentSummarizerAgent({ adapter: model({ title: 'HOA Document Summarizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for realestate-hoa-document-summarizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createRealestateHoaDocumentSummarizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
