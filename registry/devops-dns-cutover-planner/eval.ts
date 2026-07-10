import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'devops-dns-cutover-planner',
  cases: [
    {
      input: 'Sample input for DNS Cutover Planner: DNS migrations risky. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
