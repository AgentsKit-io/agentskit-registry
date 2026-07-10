import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createMarketingEmailSequenceAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_sequence_author', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('marketing-email-sequence-author', () => {
  it('returns typed v1 output', async () => {
    const r = await createMarketingEmailSequenceAuthorAgent({ adapter: model({ title: 'Email Sequence Author', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for marketing-email-sequence-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createMarketingEmailSequenceAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
