import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemIntegrationMapperAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_integration_mapper', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-integration-mapper', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemIntegrationMapperAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-integration-mapper')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemIntegrationMapperAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
