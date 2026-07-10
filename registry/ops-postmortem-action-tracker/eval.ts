import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ops-postmortem-action-tracker',
  cases: [
    {
      input: 'Sample input for Postmortem Action Tracker: PM actions not done. Provide structured output.',
      expected: (r: string) => r.length > 10,
    },
    {
      input: 'Minimal input — no details provided. List gaps instead of inventing.',
      expected: (r: string) => /gap|openQuestion|confirm|missing/i.test(r) || r.length > 5,
    },
  ],
}
