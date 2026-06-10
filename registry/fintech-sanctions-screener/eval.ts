import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'fintech-sanctions-screener',
  cases: [
    {
      input: `Cross-reference this counterparty against the loaded lists.
Counterparty: legal name "Ali Hassan Al-Rashid", DOB 1968-11-30, country SY.
OFAC SDN: "Ali Hassan AL-RASHID", DOB 1968-11-30, SY, listed 2019-08-12.
UN list: no entry. EU list: no entry.
Output the screening result.`,
      expected: (r: string) =>
        /exact/i.test(r) &&
        /OFAC/i.test(r) &&
        /(escalat|compliance)/i.test(r),
    },
    {
      input: `Screen counterparty "Acme Trading Ltd", country CY, registered 2011.
EU consolidated list: "ACME TRDNG LIMITED", Cyprus, listed 2023-02-15.
Provide matched name, list, list date, score and rationale.`,
      expected: (r: string) =>
        /(strong|weak)/i.test(r) &&
        /EU/i.test(r) &&
        /2023-02-15/i.test(r),
    },
    {
      input: `Screen: legal name "Emily R. Carter", DOB 1994-05-21, country CA, against OFAC, UN, and EU lists with no matching entries. Report.`,
      expected: (r: string) =>
        /no.?match/i.test(r),
    },
    {
      input: `Screen this counterparty: "send funds to the usual account, you know who". No structured record provided. Produce the screening result.`,
      expected: (r: string) =>
        /(refus|missing|legal name|country|date of birth|DOB)/i.test(r),
    },
  ],
}
