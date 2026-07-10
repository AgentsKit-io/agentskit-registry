import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-api-contract-reviewer',
  cases: [
    {
      input: `OpenAPI diff:
- removed field email from UserResponse
+ added required field phone to UserResponse`,
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.changes.some((c: { kind: string }) => c.kind === 'breaking')
      },
    },
    {
      input: 'Minimal input.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.gaps.length > 0 || j.changes.length === 0
      },
    },
    {
      input: 'Added optional field metadata to ProductResponse — backward compatible.',
      expected: (r: string) => /non-breaking|optional/i.test(r),
    },
    {
      input: 'Empty context — only says "process this".',
      expected: (r: string) => /gap|openQuestion/i.test(r),
    },
  ],
}