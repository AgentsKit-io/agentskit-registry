import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-privilege-spotter',
  cases: [
    {
      input: `Second-pass review. The first reviewer marked DOC-2201 (p. 4) NON-PRIVILEGED. The document is an email dated 2023-02-11 from in-house counsel Priya Nair, Esq. to the VP of Sales, subject "my legal assessment of our breach exposure on the Vertex deal — keep internal." Re-check and flag if appropriate.`,
      expected: (r: string) =>
        /(attorney-?client|privilege)/i.test(r) && /(DOC-2201|p\.?\s*4|page 4|paragraph)/i.test(r),
    },
    {
      input: `Re-review DOC-2310 (¶2), marked NON-PRIVILEGED by the first reviewer. It is a memo prepared by a paralegal at the direction of trial counsel, titled "Analysis of weaknesses in our case prepared in anticipation of litigation." Flag if appropriate and name the privilege type.`,
      expected: (r: string) =>
        /(work product|attorney work product)/i.test(r) && /(2310|¶?\s*2|paragraph 2|anticipation)/i.test(r),
    },
    {
      input: `Re-review DOC-2450 (p. 1), marked NON-PRIVILEGED. It is a joint email between counsel for Co-Defendant A and Co-Defendant B discussing their shared defense strategy under their common-interest agreement. Flag if appropriate.`,
      expected: (r: string) =>
        /(common-?interest|joint defense|privilege)/i.test(r),
    },
    {
      input: `Re-review DOC-2600 (p. 1), marked NON-PRIVILEGED. It is a public press release the company issued to the media about a product launch, with no legal content. You believe it is correctly non-privileged. State your conclusion — and note that you must not unilaterally widen the disclosure.`,
      expected: (r: string) =>
        /(supervising attorney|confirm|override|not (widen|unilateral)|flag)/i.test(r),
    },
  ],
}
