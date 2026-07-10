import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createLegalJurisdictionAnalyzerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_jurisdiction_analyzer', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('legal-jurisdiction-analyzer', () => {
  it('returns typed output', async () => {
    const r = await createLegalJurisdictionAnalyzerAgent({ adapter: model({"score":50,"band":"medium","factors":["f"],"rationale":"r","gaps":[]}) }).run('sample input for legal-jurisdiction-analyzer')
    expect(r.requiresReview).toBe(true)
    expect(r.score).toBe(50)
  })

  it('refuses empty input', async () => {
    await expect(createLegalJurisdictionAnalyzerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
