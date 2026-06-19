import type { EvalSuite } from '@agentskit/eval'

/** Eval cases for the reviewer AgentHandle (`run(document) → jsonLegalReviewResult`). */
export const suite: EvalSuite = {
  name: 'legal-doc-reviewer',
  cases: [
    {
      input: 'Vendor shall indemnify Client for any and all losses without limitation. No cap on liability.',
      expected: (r: string) => /"findings":\[/.test(r),
    },
  ],
}
