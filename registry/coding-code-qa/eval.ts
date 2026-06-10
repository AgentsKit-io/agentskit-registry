import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-code-qa',
  cases: [
    {
      input: `Branch: feat/payment-retry. Commands: \`pnpm test\`, \`pnpm lint\`, \`pnpm typecheck\`. The test run produced:
FAIL src/payment/retry.test.ts > retries on 503
  AssertionError: expected 2 to equal 3
    at src/payment/retry.test.ts:42:18
FAIL src/payment/retry.test.ts > backoff doubles each attempt
  AssertionError: expected 200 to equal 400
    at src/payment/retry.test.ts:58:20
Run all three commands and summarise the failures.`,
      expected: (r: string) => /retry\.test\.ts/i.test(r) && /(root cause|likely|because|cause)/i.test(r),
    },
    {
      input: `Branch: chore/upgrade-zod. Commands: \`pnpm typecheck\`, \`pnpm test\`. typecheck output:
src/schema/user.ts:12:5 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'ZodString'.
src/schema/user.ts:19:5 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'ZodNumber'.
Group failures by likely root cause and give the shortest reproducer for each.`,
      expected: (r: string) => /user\.ts/i.test(r) && /(zod|TS2345|type)/i.test(r),
    },
    {
      input: `Branch: main. Commands: \`pnpm test\` (took 41s), \`pnpm lint\` (took 6s), \`pnpm typecheck\` (took 18s). All commands exited 0 with zero failures. Report the result.`,
      expected: (r: string) => /all green/i.test(r) && /41s|41 s|41 second/i.test(r),
    },
    {
      input: `Branch: feat/search-index. You are asked to run QA but no test/lint/type-check commands were provided and the package.json scripts section is empty. Proceed.`,
      expected: (r: string) => /(no (test|command)|missing|cannot|not provided|unable|escalat|need)/i.test(r),
    },
  ],
}
