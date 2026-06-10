import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-dev-implementer',
  cases: [
    {
      input: `PRD JSON: {"criteria":["parseAmount(input: string) returns a positive integer of cents or throws on invalid input"]}. Spec stub:
describe('parseAmount', () => {
  it('criterion 1: parses "12.50" to 1250', () => { expect(parseAmount('12.50')).toBe(1250) })
  it('criterion 1: throws on "abc"', () => { expect(() => parseAmount('abc')).toThrow() })
})
Target branch: main. Implement the production TypeScript and open a draft PR.`,
      expected: (r: string) => /export\s+(function|const)\s+parseAmount/i.test(r) && /(zod|throw|guard)/i.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["loadConfig() reads env vars APP_PORT and APP_HOST and returns a validated Config object"]}. Spec stub references loadConfig from '../src/config'. Write a minimal patch with a Zod-validated boundary and a named export, then call github.createPR.`,
      expected: (r: string) => /export\s+(function|const)\s+loadConfig/i.test(r) && /z\.(object|string|number)/i.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["normalizeEvent(raw: unknown) narrows the incoming webhook payload to a typed AnalyticsEvent"]}. The payload shape is unknown at the boundary. Implement it without using any.`,
      expected: (r: string) => /unknown/i.test(r) && !/:\s*any\b/.test(r) && /export/i.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["the checkout flow should be faster"]}. There is no spec stub provided and the criterion has no testable assertion. Implement.`,
      expected: (r: string) => /(no spec|missing|ambiguous|cannot|not testable|need|clarif|escalat|unable)/i.test(r),
    },
  ],
}
