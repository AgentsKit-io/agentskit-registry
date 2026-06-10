import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'support-kb-searcher',
  cases: [
    {
      input: `Ticket: A customer asks how to rotate their API key after a suspected leak. They want to know if rotating invalidates the old key immediately and whether existing webhooks keep working. Find the relevant KB articles.`,
      expected: (r: string) => /(http|www|\/docs|kb)/i.test(r) && /confidence/i.test(r),
    },
    {
      input: `Ticket: User on the Pro plan wants to downgrade to Starter mid-cycle and is asking whether they get a prorated refund. Find the top knowledge-base articles that answer this.`,
      expected: (r: string) => /([1-5])/.test(r) && /(refund|proration|prorate|downgrade|billing)/i.test(r),
    },
    {
      input: `Ticket: Customer reports that SAML SSO login redirects them back to the login page in a loop after entering their Okta credentials. Find KB articles covering SSO / SAML troubleshooting.`,
      expected: (r: string) => /(SSO|SAML|Okta|login)/i.test(r) && /title/i.test(r),
    },
    {
      input: `Ticket: A customer is asking for detailed guidance on integrating our product with an obscure in-house ERP that we have never documented anywhere. Search the knowledge base.`,
      expected: (r: string) => /(no (good )?match|no relevant|could not find|no article|suggest)/i.test(r),
    },
  ],
}
