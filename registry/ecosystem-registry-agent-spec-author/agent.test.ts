import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemRegistryAgentSpecAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({ response: () => [{ type: 'tool_call', toolCall: { id: '1', name: 'submit_spec_author', args: JSON.stringify(payload) } }, { type: 'done' }] })

describe('ecosystem-registry-agent-spec-author', () => {
  it('returns typed v1 output', async () => {
    const r = await createEcosystemRegistryAgentSpecAuthorAgent({ adapter: model({ title: 'Registry Agent Spec Author', sections: [{ heading: 'Summary', body: 'content', citations: [] }], gaps: [], openQuestions: [] }) }).run('sample input for ecosystem-registry-agent-spec-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })
  
  it('refuses empty input', async () => {
    await expect(createEcosystemRegistryAgentSpecAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
