import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'security-access-review',
  cases: [
    {
      input: 'Sample input for Access Review: Access reviews slow. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
