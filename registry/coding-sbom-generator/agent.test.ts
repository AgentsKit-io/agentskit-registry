import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createCodingSbomGeneratorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_sbom_generator', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-sbom-generator', () => {
  it('returns typed output', async () => {
    const r = await createCodingSbomGeneratorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for coding-sbom-generator')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createCodingSbomGeneratorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
