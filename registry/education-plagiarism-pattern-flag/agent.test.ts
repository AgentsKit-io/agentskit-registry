import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationPlagiarismPatternFlagAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_pattern_flag', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-plagiarism-pattern-flag', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationPlagiarismPatternFlagAgent({ adapter: model({ title: 'Plagiarism Pattern Flag', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-plagiarism-pattern-flag')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationPlagiarismPatternFlagAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
