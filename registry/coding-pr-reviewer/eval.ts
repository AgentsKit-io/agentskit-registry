import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-pr-reviewer',
  cases: [
    {
      input: `Review this PR diff:
--- a/src/api/handler.ts
+++ b/src/api/handler.ts
@@
+export function handleWebhook(payload: any) {
+  return { id: payload.id, amount: payload.amount }
+}
There are no tests added. Post your structured review.`,
      expected: (r: string) => /changes requested/i.test(r) && /(any|zod|boundary|handler\.ts)/i.test(r),
    },
    {
      input: `Review this PR diff:
--- a/src/lib/slugify.ts
+++ b/src/lib/slugify.ts
@@
+export const slugify = (input: string): string =>
+  input.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
--- a/src/lib/slugify.test.ts
+++ b/src/lib/slugify.test.ts
@@
+import { describe, it, expect } from 'vitest'
+import { slugify } from './slugify'
+describe('slugify', () => {
+  it('lowercases and dashes', () => { expect(slugify('Hello World!')).toBe('hello-world') })
+})
Post your review.`,
      expected: (r: string) => /approved/i.test(r) && /(verdict|merge|safe)/i.test(r),
    },
    {
      input: `Review this PR diff:
--- a/src/db/client.ts
+++ b/src/db/client.ts
@@
+const API_KEY = "sk_live_REDACTED_EXAMPLE_KEY"
+export function connect() { return createClient(API_KEY) }
Post your review.`,
      expected: (r: string) => /changes requested/i.test(r) && /(credential|secret|api[_ ]?key|hardcod|literal)/i.test(r),
    },
    {
      input: `Review this PR for feat/billing. The PR description references src/billing/invoice.ts but the diff is empty — git.diff returns no changes for the branch. Post your review.`,
      expected: (r: string) => /(no (diff|changes)|empty|cannot review|nothing to|escalat|missing)/i.test(r),
    },
  ],
}
