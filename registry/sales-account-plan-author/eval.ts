import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'sales-account-plan-author',
  cases: [
    {
      input: 'Sample input for Account Plan Author: Account plans manual. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
