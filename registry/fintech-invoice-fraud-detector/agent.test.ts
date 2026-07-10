import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createFintechInvoiceFraudDetectorAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_fraud_detector', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('fintech-invoice-fraud-detector', () => {
  it('returns typed output', async () => {
    const r = await createFintechInvoiceFraudDetectorAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for fintech-invoice-fraud-detector')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createFintechInvoiceFraudDetectorAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
