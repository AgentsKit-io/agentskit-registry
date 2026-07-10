import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEducationCurriculumMapperAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_curriculum_mapper', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('education-curriculum-mapper', () => {
  it('returns typed v1 output', async () => {
    const r = await createEducationCurriculumMapperAgent({ adapter: model({ title: 'Curriculum Mapper', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for education-curriculum-mapper')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEducationCurriculumMapperAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
