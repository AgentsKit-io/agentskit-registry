import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'marketing-brief-analyst',
  cases: [
    {
      input: `Campaign brief — Client: Lumen, a B2B time-tracking SaaS. Objective: drive conversions to the 14-day trial. Target audience: agency operations managers at 10-50 person creative shops. Key messages: (1) stop chasing timesheets, (2) profitability per client in real time, (3) onboard in under a day. Tone: confident, no jargon. Channels: LinkedIn + email. Timeline: kickoff 2026-07-01, launch 2026-07-15. Mandatory: must include "Results may vary" disclaimer; never use the word "synergy".`,
      expected: (r: string) =>
        /conversion/i.test(r) && /(objective|audience|keyMessages|channels)/i.test(r),
    },
    {
      input: `Brief for Northstar Bank's "Smart Saver" launch. Audience: gig-economy workers 22-35 with irregular income. Objective: brand awareness. Key messages: round-up savings, no minimum balance, FDIC insured. Tone: empowering but trustworthy. Channels: Instagram, TikTok. Timeline: Q3 2026. Mandatory legal line: "Member FDIC". Brand ban: do not claim "guaranteed returns".`,
      expected: (r: string) =>
        /awareness/i.test(r) && /(mandator|FDIC|legal)/i.test(r),
    },
    {
      input: `Brief: We want a campaign for our new product. Make it pop and get us lots of customers. Budget is flexible. Go.`,
      expected: (r: string) =>
        /(gap|missing|absent|clarif|cannot|unable|insufficient|need more)/i.test(r),
    },
    {
      input: `Brief for Acme CRM retention push. Audience: existing customers on month-to-month plans showing low feature adoption. Objective: retention. Key messages: you're only using 2 of 12 features, book a success call, lock in annual pricing. Tone: edgy, a little aggressive — "ditch the dinosaur tools or get left behind". Channels: in-app + email. Timeline: ongoing. Note: brand voice guide says tone must stay supportive and never shame the user.`,
      expected: (r: string) =>
        /(voiceFlag|conflict|flag|tone|shame|voice)/i.test(r) && /retention/i.test(r),
    },
  ],
}
