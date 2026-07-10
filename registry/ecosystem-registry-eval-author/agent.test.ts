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
  it('returns typed eval suite draft', async () => {
    const r = await createEcosystemRegistryEvalAuthorAgent({
      adapter: model({
        suiteName: 'legal-doc-reviewer',
        cases: [
          { input: 'indemnity clause', expectedDescription: 'findings array non-empty', rationale: 'core path' },
          { input: 'minimal', expectedDescription: 'gaps present', rationale: 'thin input' },
        ],
        gaps: [],
        openQuestions: [],
      }),
    }).run('Agent: legal-doc-reviewer — contract review')
    expect(r.suiteName).toBe('legal-doc-reviewer')
    expect(r.cases).toHaveLength(2)
    expect(r.requiresReview).toBe(true)
  })

  it('refuses empty input', async () => {
    await expect(createEcosystemRegistryEvalAuthorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})