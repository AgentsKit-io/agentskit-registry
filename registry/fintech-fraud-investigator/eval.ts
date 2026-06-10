import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'fintech-fraud-investigator',
  cases: [
    {
      input: `Investigate this card account's last 90 minutes of activity:
TXN-9001 14:02 $4.10 coffee, San Francisco CA
TXN-9002 14:31 $1,920.00 electronics, Lagos NG
TXN-9003 14:33 $1,980.00 electronics, Lagos NG
TXN-9004 14:35 $1,955.00 electronics, Lagos NG
TXN-9005 14:38 $1,910.00 electronics, Lagos NG
Flag any anomalous cluster and draft a case file.`,
      expected: (r: string) =>
        /velocity|structuring|geograph/i.test(r) &&
        /TXN-900[2-5]/i.test(r) &&
        /(draft|case file|recommend)/i.test(r),
    },
    {
      input: `Review wire history for account ACC-4421:
WIRE-7001 09:00 $9,800 to BeneA
WIRE-7002 09:14 $9,750 to BeneB
WIRE-7003 09:27 $9,900 to BeneC
WIRE-7004 09:41 $9,600 to BeneD
All just under the $10,000 reporting threshold. Assess.`,
      expected: (r: string) =>
        /structuring/i.test(r) &&
        /WIRE-700[1-4]/i.test(r),
    },
    {
      input: `Look at TXN-5500 ($62.40 grocery, home city) and TXN-5501 ($58.10 pharmacy, home city), two transactions a day apart, same merchant region as the cardholder's usual pattern. Is this fraud?`,
      expected: (r: string) =>
        /(insufficient evidence|no anomal|normal|monitor|low risk)/i.test(r),
    },
    {
      input: `Cardholder claims fraud but the file you received only contains: "see attached" with no transaction list. Investigate and draft a case file.`,
      expected: (r: string) =>
        /(insufficient evidence|missing|no transaction|cannot|unable|escalat)/i.test(r),
    },
  ],
}
