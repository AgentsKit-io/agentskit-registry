import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-qa-author',
  cases: [
    {
      input: `PRD JSON: {"criteria":["1. calculateTax(amount, region) returns the correct VAT for 'EU' at 21%","2. calculateTax throws on an unknown region"]}. The project uses Vitest and names spec files *.test.ts next to the source. Produce the spec stubs.`,
      expected: (r: string) => /describe\(/.test(r) && /\bit\(/.test(r) && /\.test\.ts/i.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["1. The /health endpoint returns 200 with { status: 'ok' } when the database is reachable"]}. Produce a Vitest spec stub referencing criterion 1.`,
      expected: (r: string) => /criterion 1/i.test(r) && /expect\(/.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["1. debounce(fn, ms) only invokes fn once after rapid successive calls within the window"]}. Generate the spec stub; you may use expect.assertions and todo placeholders but no it.skip.`,
      expected: (r: string) => /describe\(/.test(r) && !/it\.skip/.test(r),
    },
    {
      input: `PRD JSON: {"criteria":[]}. The acceptance criteria list is empty. Produce the Vitest spec stubs.`,
      expected: (r: string) => /(no (criteria|criterion)|empty|nothing to|cannot|missing|escalat|need)/i.test(r),
    },
  ],
}
