import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'marketing-calendar-digest-author',
  cases: [
    {
      input: `Scheduled posts for the next 7 days (week of 2026-06-15):
- 2026-06-15 | LinkedIn | "Stop chasing timesheets" | persona: Agency Ops Manager
- 2026-06-16 | Slack | "Release notes: real-time profitability" | persona: Power User
- 2026-06-17 | Discord | "Community AMA Thursday" | persona: Indie Dev
- 2026-06-18 | LinkedIn | "Onboard in under a day" | persona: Agency Ops Manager
Produce the weekly Slack digest.`,
      expected: (r: string) =>
        /Social Calendar/i.test(r) && /(LinkedIn|Slack|Discord)/.test(r),
    },
    {
      input: `Posts for week of 2026-07-06:
- 2026-07-06 | Discord | "Beta invites are live" | persona: Early Adopter
- 2026-07-08 | Discord | "Office hours recap" | persona: Early Adopter
- 2026-07-10 | Discord | "Roadmap vote open" | persona: Early Adopter
Generate the digest and note the total count.`,
      expected: (r: string) =>
        /Discord/.test(r) && /3/.test(r),
    },
    {
      input: `Here is the schedule for the upcoming week (week of 2026-08-03): there are no posts queued in any channel. Generate the digest.`,
      expected: (r: string) =>
        /No posts scheduled this week/i.test(r),
    },
    {
      input: `Week of 2026-09-21 schedule:
- 2026-09-21 | Slack | "Q4 pricing update" | persona: Finance Buyer
- 2026-09-22 | LinkedIn | "Customer story: 30% margin lift" | persona: Agency Ops Manager
- 2026-09-23 | Slack | "Webinar signup" | persona: Finance Buyer
- 2026-09-25 | LinkedIn | "Hiring: GTM lead" | persona: Talent
Build the digest with per-channel breakdown.`,
      expected: (r: string) =>
        /Social Calendar/i.test(r) && /(breakdown|total|4)/i.test(r) && /Slack/.test(r),
    },
  ],
}
