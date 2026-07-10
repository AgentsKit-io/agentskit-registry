import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemLlmsTxtOptimizerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_txt_optimizer', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecosystem-llms-txt-optimizer', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcosystemLlmsTxtOptimizerAgent({ adapter: model({ title: 'llms.txt Optimizer', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecosystem-llms-txt-optimizer')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcosystemLlmsTxtOptimizerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
