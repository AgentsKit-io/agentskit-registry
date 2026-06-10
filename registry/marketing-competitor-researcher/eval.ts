import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'marketing-competitor-researcher',
  cases: [
    {
      input: `Research these competitors for the Lumen time-tracking campaign: Harvest (getharvest.com), Toggl (toggl.com), Clockify (clockify.me). Fetch each homepage and pricing page, compare against our competitor baseline, and report positioning gaps and messaging opportunities.`,
      expected: (r: string) =>
        /(positioning|opportunit|messaging)/i.test(r) && /(Harvest|Toggl|Clockify)/i.test(r),
    },
    {
      input: `Competitor watch for Northstar Bank's Smart Saver launch. Targets: Chime (chime.com), Acorns (acorns.com). Check their pricing/fees pages and any recent "feature announcement" blog posts. Flag any pricing changes since our baseline.`,
      expected: (r: string) =>
        /(pricing|pricingChanges|fee)/i.test(r) && /(Chime|Acorns)/i.test(r),
    },
    {
      input: `Competitor URLs to research: notion.so, airtable.com, and internal-staging.acme.local (this last one is behind our VPN/paywall and will return 403). Fetch homepages and report. The acme staging page cannot be reached externally.`,
      expected: (r: string) =>
        /(unverified|manual check|could not|cannot|403|paywall|unable)/i.test(r),
    },
    {
      input: `Build a competitive landscape report for Acme CRM. Competitors: HubSpot (hubspot.com), Pipedrive (pipedrive.com), Salesforce Starter (salesforce.com). Look for new positioning claims and feature announcements, summarize the opportunity gaps we can own.`,
      expected: (r: string) =>
        /(opportunityGaps|opportunit|gap)/i.test(r) && /summary/i.test(r),
    },
  ],
}
