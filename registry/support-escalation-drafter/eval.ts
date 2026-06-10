import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'support-escalation-drafter',
  cases: [
    {
      input: `Ticket #20451 from Maria Gonzalez (maria.gonzalez@globex.com), account GLOBEX-3320.
Agent notes: Customer reports exported CSV reports have been missing the last 3 columns since the Tuesday release. Confirmed reproducible on two of their workspaces. Cleared cache, re-ran export, checked their column config — all fine on our side. Looks like a regression in the export service. Need engineering to investigate the v4.2 export changes. Customer has a board meeting Friday and needs these reports.`,
      expected: (r: string) => /(customer impact|impact)/i.test(r) && /(engineering|investigation)/i.test(r) && /SLA/i.test(r),
    },
    {
      input: `Ticket #18877 from James O'Neill (james.oneill@initech.io), account INITECH-9001.
Agent notes: Customer charged twice for the annual Enterprise plan ($14,400 each) due to a double-submit on the upgrade form. Verified two successful charges on the same invoice id in Stripe. Customer wants the duplicate refunded today. This exceeds my refund authority — needs manager / refund approval.`,
      expected: (r: string) => /(refund approval|refund)/i.test(r) && /(what we tried|tried|verified)/i.test(r) && /(what we need|need)/i.test(r),
    },
    {
      input: `Ticket #21002 from Priya Raman (priya.raman@umbrella.co), account UMBRELLA-5512.
Agent notes: Strategic customer (renewal next month) is frustrated — third outage-related ticket this quarter. They are threatening to churn and have asked to speak with someone senior about their roadmap concerns. Technically nothing is broken right now, but this needs an account-manager call to save the relationship.`,
      expected: (r: string) => /(account[- ]manager|account manager|AM) call/i.test(r) && /(churn|renewal|relationship)/i.test(r),
    },
    {
      input: `Ticket #19310 — escalation request.
Agent notes: Customer says "it's still not working and I'm angry." No account id, no product area, no reproduction steps, and I haven't been able to reach them. They just want this escalated.`,
      expected: (r: string) => /(missing|insufficient|need more|cannot draft|unable|gather|account id|reproduction)/i.test(r),
    },
  ],
}
