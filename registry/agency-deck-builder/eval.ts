import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'agency-deck-builder',
  cases: [
    {
      input: `Build a status deck.
Brief: Q2 social campaign for Lumen Chill cold-brew.
KPIs (source: GA4 export): reach 4.2M, CTR 1.8%, sign-ups 12,400.
Milestone notes: hero film delivered on time; OOH delayed 1 week; UGC contest over-performed (+40% entries vs target).
Use the standard deck structure.`,
      expected: (r: string) =>
        /(cover|context)/i.test(r) && /next steps/i.test(r) && /(4\.2M|1\.8%|12,?400)/i.test(r),
    },
    {
      input: `Build a pitch deck.
Brief: win the Meridian Bank "Round-Up Savings" launch account.
KPIs to highlight (source: our case-study deck): prior fintech client grew app installs 3.1x, CAC down 22%.
Milestone notes: proposed 6-week sprint, hero concept "small change, big calm".
Slide-by-slide markdown please.`,
      expected: (r: string) =>
        /(cover|context)/i.test(r) && /(3\.1x|22%)/i.test(r) && /(##|slide|---)/i.test(r),
    },
    {
      input: `Status deck for Halcyon Outdoors trail-shoe campaign.
Brief artifact attached. KPIs (source: retail-sell-through report): sell-through 68%, returns 4%.
Milestone notes: athlete content series live; print on schedule; "what to change" — shift budget from print to athlete content next quarter.
Standard structure, one idea per slide.`,
      expected: (r: string) =>
        /(what worked|what to change)/i.test(r) && /(68%|4%)/i.test(r) && /next steps/i.test(r),
    },
    {
      input: `Build a status deck for the Forge Fitness retainer. Brief: Q3 retention push. Milestone notes say "engagement felt up and the email thing did well." No KPI artifacts or metrics were provided. Put together the deck.`,
      expected: (r: string) =>
        /data to be confirmed/i.test(r),
    },
  ],
}
