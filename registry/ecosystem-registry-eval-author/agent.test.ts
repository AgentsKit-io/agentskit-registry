import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createEcosystemRegistryEvalAuthorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_eval_author', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('ecosystem-registry-eval-author', () => {
  it('returns typed output', async () => {
    const r = await createEcosystemRegistryEvalAuthorAgent({ adapter: model({"title":"doc","sections":[{"heading":"h","body":"b","citations":[]}],"gaps":[],"openQuestions":[]}) }).run('sample input for ecosystem-registry-eval-author')
    expect(r.requiresReview).toBe(true)
    expect(r.sections.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemRegistryEvalAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
