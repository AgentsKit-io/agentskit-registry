import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'support-macro-suggester',
  cases: [
    {
      input: 'Sample input for Macro Suggester: Repetitive replies. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
