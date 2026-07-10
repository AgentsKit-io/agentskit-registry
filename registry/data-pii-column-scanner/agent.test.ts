import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createDataPiiColumnScannerAgent } from './agent'

const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: '1', name: 'submit_column_scanner', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('data-pii-column-scanner', () => {
  it('returns typed output', async () => {
    const r = await createDataPiiColumnScannerAgent({ adapter: model({"summary":"ok","findings":[{"id":"1","severity":"low","message":"test"}],"gaps":[],"openQuestions":[]}) }).run('sample input for data-pii-column-scanner')
    expect(r.requiresReview).toBe(true)
    expect(r.findings.length).toBeGreaterThan(0)
  })

  it('refuses empty input', async () => {
    await expect(createDataPiiColumnScannerAgent({ adapter: model({}) }).run('  ')).rejects.toThrow()
  })
})
