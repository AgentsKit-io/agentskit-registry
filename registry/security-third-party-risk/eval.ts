import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'security-third-party-risk',
  cases: [
    {
      input: 'Sample input for Third-party Risk: Vendor risk. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
