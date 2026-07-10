import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechCovenantMonitorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_covenant_monitor', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('fintech-covenant-monitor', () => {
  it('returns typed v1 output', async () => {
    const r = await createFintechCovenantMonitorAgent({ adapter: model({ title: 'Covenant Monitor', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for fintech-covenant-monitor')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createFintechCovenantMonitorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
