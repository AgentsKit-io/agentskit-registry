import { describe, it, expect } from 'vitest'
import { mockAdapter } from '@agentskit/adapters'
import { createTestRunnerAgent } from './agent'

const REPORT = {
  passed: 10,
  failed: 1,
  skipped: 0,
  duration: '1.2s',
  failures: [{ test: 'auth > rejects expired', file: 'auth.test.ts', message: 'expected 401 got 200', rootCause: 'expiry check uses < not <=' }],
  summary: '1 failure in auth',
}
const model = (payload: Record<string, unknown>) =>
  mockAdapter({
    response: () => [
      { type: 'tool_call', toolCall: { id: 't', name: 'submit_report', args: JSON.stringify(payload) } },
      { type: 'done' },
    ],
  })

describe('coding-test-runner', () => {
  it('parses raw output into a typed report with per-failure root cause', async () => {
    const r = await createTestRunnerAgent({ adapter: model(REPORT) }).run('FAIL auth.test.ts ...')
    expect(r.passed).toBe(10)
    expect(r.failed).toBe(1)
    expect(r.failures[0].rootCause).toMatch(/expiry/)
  })

  it('refuses empty output', async () => {
    await expect(createTestRunnerAgent({ adapter: model(REPORT) }).run('  ')).rejects.toThrow(/Vitest output/)
  })
})
