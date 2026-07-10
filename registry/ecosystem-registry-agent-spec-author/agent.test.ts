import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemRegistryAgentSpecAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_spec_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-registry-agent-spec-author', () => {
  it('returns typed spec draft', async () => {
    const r = await createEcosystemRegistryAgentSpecAuthorAgent({
      adapter: model({
        pain: 'resume screening is slow',
        output: 'fit score with rationale',
        gates: ['typed-output', 'never-invent', 'always-draft'],
        zodOutline: '{ score: number; band: enum }',
        tags: ['hr'],
        gaps: [],
        openQuestions: [],
      }),
    }).run('Idea: HR resume screener. Category: hr.')
    expect(r.gates).toContain('typed-output')
    expect(r.zodOutline.length).toBeGreaterThan(5)
    expect(r.requiresReview).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemRegistryAgentSpecAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})