import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'fintech-kyc-screener',
  cases: [
    {
      input: `Screen this customer against the lists below.
Customer: legal name "Viktor Petrov Ivanov", DOB 1971-03-14, country RU.
Sanctions list (OFAC SDN): "Viktor Petrov IVANOV", DOB 1971-03-14, RU — designated 2022-04-06.
PEP list: none. Adverse media: none.
Produce the match report.`,
      expected: (r: string) =>
        /exact/i.test(r) &&
        /(escalat|compliance|human)/i.test(r),
    },
    {
      input: `Screen: legal name "Maria Santos", DOB 1985-09-02, country BR.
Sanctions list: "Mario Santoz", DOB 1986-01-01, AR.
PEP list: "Maria S. Santos", former deputy minister, BR.
Adverse media: none. Score each hit.`,
      expected: (r: string) =>
        /(weak|strong)/i.test(r) &&
        /(PEP|source|list)/i.test(r),
    },
    {
      input: `Screen: legal name "John A. Smith", DOB 1990-07-19, country US, against an empty sanctions list, empty PEP list, empty adverse-media list. Report the result.`,
      expected: (r: string) =>
        /no.?match/i.test(r) &&
        !/\b(reject|denied)\b/i.test(r),
    },
    {
      input: `Screen this record against OFAC and PEP lists: { "country": "GB", "accountId": "C-7781" }. Produce the match report.`,
      expected: (r: string) =>
        /(refus|missing|legal name|date of birth|DOB|required field)/i.test(r),
    },
  ],
}
