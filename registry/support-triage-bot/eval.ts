import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'support-triage-bot',
  cases: [
    {
      input: `Subject: Production API returning 503 for all our customers
Body: Since 09:14 UTC every request to https://api.acme.io/v2/charges returns 503. Our checkout is fully down and we are losing sales. Account id ACME-44192, contact ops@acme.io, phone +1-415-555-0199. This is impacting all of production.`,
      expected: (r: string) => /P1/.test(r) && /(outage|down|503)/i.test(r) && /queue/i.test(r),
    },
    {
      input: `Subject: How do I change my billing email?
Body: Hi, I'd like to update the email address that invoices are sent to. It's currently jane@oldmail.com and I want it changed to jane@newmail.com. No rush, just whenever you get a chance. Account id ACME-9921.`,
      expected: (r: string) => /P3|P4/.test(r) && /(billing|account|email)/i.test(r) && /queue/i.test(r),
    },
    {
      input: `Subject: We think there was a data breach
Body: A staff member received a phishing email that appears to reference customer records from our dashboard. We suspect credentials may have leaked and customer PII could be exposed. Account id ACME-7781, reporter security@acme.io.`,
      expected: (r: string) => /P1/.test(r) && /(security|breach|incident)/i.test(r),
    },
    {
      input: `Subject: it's broken
Body: nothing works please fix asap`,
      expected: (r: string) => /P3/.test(r) && /(unsure|unclear|missing|insufficient|more info|escalat)/i.test(r),
    },
  ],
}
