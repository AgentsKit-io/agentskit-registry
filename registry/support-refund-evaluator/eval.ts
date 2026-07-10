import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'support-refund-evaluator',
  cases: [
    {
      input: 'Sample input for Refund Evaluator: Refund decisions inconsistent. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
