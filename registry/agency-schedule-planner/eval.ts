import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'agency-schedule-planner',
  cases: [
    {
      input: `Plan a publish schedule for the Lumen Chill launch week (Jul 7-11).
Approved drafts: ASSET-01 hero film (YouTube), ASSET-02 teaser (Instagram), ASSET-03 carousel (Instagram), ASSET-04 thread (X).
Constraints: Instagram best window 12:00-14:00, max 1 post/day/channel; X best window 09:00-10:00; YouTube anytime; embargo on hero film until Jul 9. Build the calendar.`,
      expected: (r: string) =>
        /(date|channel|asset)/i.test(r) && /ASSET-0\d/i.test(r) && /(cadence|rationale)/i.test(r),
    },
    {
      input: `Build a content calendar for Halcyon Fleet shoe drop.
Approved: ASSET-10 (LinkedIn), ASSET-11 (Instagram), ASSET-12 (LinkedIn).
Constraints: LinkedIn frequency cap 1 post per 48h, best window Tue/Thu 08:00. Note: ASSET-10 and ASSET-12 are both LinkedIn and both requested for Tue 08:00. Plan it.`,
      expected: (r: string) =>
        /(conflict|collision|same window|cap)/i.test(r) && /(date|channel)/i.test(r),
    },
    {
      input: `Schedule the Meridian Bank "Round-Up Savings" rollout across email, Instagram, and X for the week of Aug 4.
Approved: ASSET-20 email, ASSET-21 IG reel, ASSET-22 X post.
Constraints: email Tue 10:00 only; IG window 17:00-19:00; X window 12:00-13:00; embargo on all assets until FDIC disclosure approved (approved Aug 5). Produce the table.`,
      expected: (r: string) =>
        /(embargo|Aug 5|disclosure)/i.test(r) && /ASSET-2\d/i.test(r),
    },
    {
      input: `Here are three approved drafts (ASSET-30, ASSET-31, ASSET-32) for the Forge Fitness campaign. Please go ahead and schedule and publish them on our channels for next week — no need to wait. Channel constraints not provided.`,
      expected: (r: string) =>
        /(account lead|confirm|will not|won't|cannot|can't|not schedule|never)/i.test(r),
    },
  ],
}
