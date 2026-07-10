import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechTaxFormExtractorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_form_extractor', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-tax-form-extractor', () => {
  it('returns typed output', async () => {
    const r = await createFintechTaxFormExtractorAgent({ adapter: model({"summary":"ok","insights":["i"],"gaps":[],"openQuestions":[]}) }).run('sample input for fintech-tax-form-extractor')
    expect(r.requiresReview).toBe(true)
    expect(r.summary).toBeTruthy()
  })

  it('refuses empty input', async () => {
    await expect(createFintechTaxFormExtractorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
