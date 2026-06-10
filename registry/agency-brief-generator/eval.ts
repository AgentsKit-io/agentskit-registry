import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'agency-brief-generator',
  cases: [
    {
      input: `Kickoff notes — Client: Lumen Coffee Co. Product: new cold-brew can line "Lumen Chill". Audience: urban 22-35 who buy ready-to-drink coffee. They want to feel the brand is "calm energy, not jittery hustle". Competitors: Stumptown, La Colombe. Budget: mid. Launch: Q3. Deliverables: social, OOH, 1 hero film. Draft the creative brief.`,
      expected: (r: string) =>
        /audience/i.test(r) && /(proposition|single-minded|insight)/i.test(r) && /deliverable/i.test(r),
    },
    {
      input: `Kickoff notes — Client: Meridian Bank. Product: a "Round-Up Savings" feature in their app for Gen Z. Insight from research: young customers feel guilty about spending but find budgeting apps preachy. Tone should be supportive, never lecturing. Mandatory: include FDIC disclosure line. Timeline: pitch in 3 weeks. Build the brief.`,
      expected: (r: string) =>
        /tone/i.test(r) && /(mandator|FDIC)/i.test(r) && /(timeline|3 weeks|week)/i.test(r),
    },
    {
      input: `Kickoff notes — Client: Halcyon Outdoors. Product: trail-running shoe "Halcyon Fleet". Key insight: trail runners distrust shoes marketed by influencers; they trust grip and durability data. Proposition: "earned on the descent". Deliverables: print, retail display, athlete content series. Tone: understated, technical, no hype. Draft the brief.`,
      expected: (r: string) =>
        /(client|Halcyon)/i.test(r) && /(proposition|earned on the descent)/i.test(r) && /tone/i.test(r),
    },
    {
      input: `Kickoff notes — Client: a fintech startup (name not given yet). They mentioned "something about a card for freelancers" on the call but did not share audience, budget, timeline, competitors, or deliverables. Draft whatever brief you can from this.`,
      expected: (r: string) =>
        /to be confirmed/i.test(r),
    },
  ],
}
