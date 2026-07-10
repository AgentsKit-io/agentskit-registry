import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationParentCommunicationAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_parent_communication', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-parent-communication', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationParentCommunicationAgent({ adapter: model({ title: 'Parent Communication', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-parent-communication')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationParentCommunicationAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
