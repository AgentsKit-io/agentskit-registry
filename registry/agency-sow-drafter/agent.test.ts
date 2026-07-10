import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createAgencySowDrafterAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_sow_drafter', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('agency-sow-drafter', () => {
  it('returns typed v1 output', async () => {
    const r = await createAgencySowDrafterAgent({ adapter: model({ title: 'SOW Drafter', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for agency-sow-drafter')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createAgencySowDrafterAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
