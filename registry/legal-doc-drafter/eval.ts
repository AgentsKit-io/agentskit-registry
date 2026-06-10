import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-doc-drafter',
  cases: [
    {
      input: `Draft a demand letter. Approved fact pattern (case-analyst record CA-021): Our client Maple Goods Inc. delivered $120,000 of inventory to Riverside Retail LLC on 2023-04-12 (CA-021 §3). Riverside accepted delivery (CA-021 §4) but has not paid despite an invoice due 2023-05-12 (CA-021 §5). Target document: demand letter to Riverside Retail demanding payment within 14 days.`,
      expected: (r: string) =>
        /(maple goods|riverside)/i.test(r) && /(\$120,?000|demand|payment)/i.test(r) && /(draft)/i.test(r),
    },
    {
      input: `Draft an internal memo from this approved fact pattern (record CA-055). Established facts: the contract was signed 2022-03-01 (CA-055 §2). It is likely, though not confirmed in the record, that the parties also agreed orally to a 30-day cure period. Draft the memo and clearly distinguish established facts from anything you infer.`,
      expected: (r: string) =>
        /\[inference\]/i.test(r) && /(CA-055|2022-03-01)/i.test(r),
    },
    {
      input: `Draft a motion for extension of time based on approved record CA-077: the current fact-discovery deadline is 2024-10-15 (CA-077 §6); a key witness, Dr. Alan Reese, is unavailable until 2024-12-01 due to surgery (CA-077 §7). End with the open questions the attorney must resolve before sign-off.`,
      expected: (r: string) =>
        /(open question|before sign-?off|attorney must)/i.test(r) && /(CA-077|2024-10-15|2024-12-01|Reese)/i.test(r),
    },
    {
      input: `Draft a client update letter, but the only instruction provided is "tell the client it went well." No approved case-analyst record, no document type details, and no underlying facts have been provided. Proceed.`,
      expected: (r: string) =>
        /(open question|missing|not provided|no (approved|record|fact)|cannot|insufficient|need|attorney|escalat)/i.test(r),
    },
  ],
}
