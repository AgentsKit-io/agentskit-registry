import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-contract-reviewer',
  cases: [
    {
      input: `Review this clause. Section 9.2 (p. 12): "Notwithstanding anything to the contrary, in no event shall Vendor's liability be limited, and Vendor shall be liable for all direct, indirect, consequential, and punitive damages arising out of this Agreement without limitation." Flag risk and suggest a fallback redline.`,
      expected: (r: string) =>
        /(uncapped|unlimited|no limitation|liability)/i.test(r) && /(redline|fallback|cap|limit)/i.test(r) && /(9\.2|p\.?\s*12|page 12)/i.test(r),
    },
    {
      input: `Review Section 14.1 (p. 18): "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal no later than ninety (90) days prior to the end of the then-current term." Identify the risk and propose a redline.`,
      expected: (r: string) =>
        /(automatic|auto-?renew|renewal|evergreen)/i.test(r) && /(redline|fallback|notice|opt-out|terminat)/i.test(r),
    },
    {
      input: `Review Section 7.3 (p. 9): "Provider hereby assigns to Customer all right, title, and interest in and to any and all intellectual property, including pre-existing IP and background technology, created or used in connection with the Services." Restate the obligation, flag the risk, and suggest a fallback.`,
      expected: (r: string) =>
        /(IP assignment|intellectual property|background|pre-?existing|assign)/i.test(r) && /(redline|fallback|license|carve.?out|exclude)/i.test(r),
    },
    {
      input: `Review Section 22 (p. 30): "Force Majeure. Neither party shall be liable for delays caused by events beyond its reasonable control." The firm's house playbook does not contain any guidance or preferred position on force majeure clauses. Comment on this clause.`,
      expected: (r: string) =>
        /(playbook|silent|gap|no guidance|surface|not cover|escalat)/i.test(r),
    },
  ],
}
