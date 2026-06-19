import type { EvalSuite } from '@agentskit/eval'

/** Eval cases for the investigator AgentHandle (`run(history) → jsonInvestigationResult`). */
export const suite: EvalSuite = {
  name: 'fintech-transaction-investigator',
  cases: [
    {
      input: `Account ACC-771 transactions:
TX-101 2026-06-01 deposit $9,500 (Branch A)
TX-102 2026-06-01 deposit $9,500 (Branch B)
TX-103 2026-06-02 deposit $9,400 (Branch A)
TX-104 2026-06-02 deposit $9,600 (Branch C)
TX-105 2026-06-03 wire-out $37,000 to overseas account`,
      expected: (r: string) =>
        /"findings":\[/.test(r) && /TX-10/.test(r) && /"requiresHumanReview":true/.test(r) && /(structuring|smurf|threshold)/i.test(r),
    },
    {
      input: `Account ACC-880 transactions:
TX-200 2026-06-01 coffee $4.20
TX-201 2026-06-02 groceries $63.10
TX-202 2026-06-05 salary deposit $3,200`,
      expected: (r: string) => /"insufficientEvidence":true/.test(r) || /"findings":\[\]/.test(r),
    },
  ],
}
