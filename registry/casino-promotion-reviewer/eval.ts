import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-promotion-reviewer',
  cases: [
    {
      input: `Jurisdiction: Nevada. Draft promo "Summer Match": deposit USD 100, get USD 50 free-play, 1x playthrough on slots only, eligibility 21+ enrolled loyalty members, excludes self-excluded list. Copy: "Enjoy a little extra on us this summer." Review against gaming regs, internal promo policy, and RG guidelines.`,
      expected: (r: string) => /pass/i.test(r) && /(clause|finding|citation)/i.test(r),
    },
    {
      input: `Jurisdiction: New Jersey. Draft promo "Last Chance Jackpot": copy reads "Act NOW — only 3 spots left, GUARANTEED winners every hour!" No exclusion list specified. Review against gaming regs and RG guidelines.`,
      expected: (r: string) => /fail/i.test(r) && /(guarantee|urgency|scarcity|self-exclu)/i.test(r),
    },
    {
      input: `Jurisdiction: Pennsylvania. Draft promo "VIP Reload": targeted re-engagement email to lapsed high-rollers, copy: "We miss you — come back for a USD 200 free-play boost." Audience segment includes the full lapsed-player list with no self-exclusion scrub applied. Review it.`,
      expected: (r: string) => /fail/i.test(r) && /(self-exclu|scrub|exclusion list)/i.test(r),
    },
    {
      input: `Jurisdiction: not specified. Draft promo "Mystery Bonus": mechanic, payout cap, and advertising copy all marked TBD. Review against the applicable gaming regulations.`,
      expected: (r: string) => /(unclear|unknown|not specified|missing|cannot|insufficient)/i.test(r),
    },
  ],
}
