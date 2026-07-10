import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createSupportBugReproGuideAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_repro_guide', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('support-bug-repro-guide', () => {
  it('returns typed v1 output', async () => {
    const r = await createSupportBugReproGuideAgent({ adapter: model({ title: 'Bug Repro Guide', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for support-bug-repro-guide')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createSupportBugReproGuideAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
