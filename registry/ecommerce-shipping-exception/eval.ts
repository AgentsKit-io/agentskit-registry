import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecommerce-shipping-exception',
  cases: [
    {
      input: 'Sample input for Shipping Exception: Shipping issues. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
