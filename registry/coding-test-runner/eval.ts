import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-test-runner',
  cases: [
    {
      input: `Spec files run: src/cart/total.test.ts. Vitest output:
 FAIL  src/cart/total.test.ts > cartTotal > applies the 10% discount
AssertionError: expected 90 to be 81
 ❯ src/cart/total.test.ts:23:25
 Test Files  1 failed (1)
      Tests  1 failed | 4 passed (5)
   Duration  1.92s
Produce the structured report.`,
      expected: (r: string) => /total\.test\.ts/i.test(r) && /(rootCause|root cause|cause|hypothes)/i.test(r),
    },
    {
      input: `Spec files run: src/api/users.test.ts, src/api/orders.test.ts. Vitest output:
 Test Files  2 passed (2)
      Tests  17 passed (17)
   Duration  3.41s
Produce the structured report.`,
      expected: (r: string) => /17/.test(r) && /3\.41/.test(r) && /(passed|"passed")/i.test(r),
    },
    {
      input: `Spec files run: src/parse/date.test.ts. Vitest output:
 FAIL  src/parse/date.test.ts > parseDate > ISO string
TypeError: Cannot read properties of undefined (reading 'getTime')
 ❯ src/parse/date.test.ts:11:34
 FAIL  src/parse/date.test.ts > parseDate > unix epoch
TypeError: Cannot read properties of undefined (reading 'getTime')
 ❯ src/parse/date.test.ts:18:34
      Tests  2 failed | 1 passed (3)
   Duration  0.88s
Group failures by suspected root cause.`,
      expected: (r: string) => /date\.test\.ts/i.test(r) && /(undefined|getTime|TypeError)/i.test(r),
    },
    {
      input: `Spec files run: src/queue/worker.test.ts. The Vitest process was killed before producing any summary line — the output is truncated mid-run with no totals. Produce the report.`,
      expected: (r: string) => /(incomplete|truncat|no (summary|total)|cannot|killed|unable|missing|escalat)/i.test(r),
    },
  ],
}
