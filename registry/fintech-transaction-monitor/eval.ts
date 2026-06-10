import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'fintech-transaction-monitor',
  cases: [
    {
      input: `Monitor account ACC-3310 deposits:
DEP-2201 Mon $9,500 cash
DEP-2202 Tue $9,400 cash
DEP-2203 Wed $9,700 cash
DEP-2204 Thu $9,200 cash
All branch cash deposits just below $10,000. Produce a SAR-ready draft.`,
      expected: (r: string) =>
        /structuring/i.test(r) &&
        /DEP-220[1-4]/i.test(r) &&
        /(SAR|case file|draft)/i.test(r),
    },
    {
      input: `Monitor ACC-8800:
TXN-1 10:00 incoming wire $48,000 from overseas
TXN-2 10:06 outgoing $15,000
TXN-3 10:09 outgoing $16,000
TXN-4 10:12 ATM withdrawal $16,500
Funds in and fully out within 12 minutes. Assess.`,
      expected: (r: string) =>
        /(rapid|movement|layering|withdrawal)/i.test(r) &&
        /TXN-[1-4]/i.test(r) &&
        /(SAR|draft|case file|next step)/i.test(r),
    },
    {
      input: `Monitor ACC-1200:
PAY-5001 Mon $42.18 utilities
PAY-5002 Wed $61.07 groceries
PAY-5003 Fri $129.99 phone bill
Normal salaried-customer spending. Anything to report?`,
      expected: (r: string) =>
        /(insufficient evidence|monitor|no.*(pattern|anomal)|normal|low risk)/i.test(r),
    },
    {
      input: `Monitor this account. The export tool returned an empty result set — zero transactions for the requested window. Produce your assessment.`,
      expected: (r: string) =>
        /(insufficient evidence|no transaction|empty|cannot|unable|monitor)/i.test(r),
    },
  ],
}
