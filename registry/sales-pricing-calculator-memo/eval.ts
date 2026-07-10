import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'sales-pricing-calculator-memo',
  cases: [
    {
      input: 'Sample input for Pricing Calculator Memo: Pricing opaque. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
