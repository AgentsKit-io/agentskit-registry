import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'agency-copy-reviewer',
  cases: [
    {
      input: `Brand voice guide — Client: Solace Skincare. Tone: warm, plain-spoken, science-backed. Banned words: "miracle", "anti-aging", "flawless". Audience: women 30-50 who distrust hype.
Draft copy to review:
L1: "This miracle serum erases wrinkles overnight."
L2: "Clinically tested on 120 participants over 8 weeks."
L3: "Get flawless skin or your money back."
Review against the guide.`,
      expected: (r: string) =>
        /(miracle|flawless)/i.test(r) && /(rewrite|suggest)/i.test(r) && /(rationale|guide|banned)/i.test(r),
    },
    {
      input: `Brand voice guide — Client: Forge Fitness. Tone: blunt, motivating, no corporate fluff. Vocabulary: short sentences, active voice. Banned: "synergy", "leverage", "best-in-class".
Draft copy:
L1: "Leverage our best-in-class equipment to maximize synergy in your fitness journey."
L2: "Show up. Lift. Repeat."
Flag misalignments and assess overall.`,
      expected: (r: string) =>
        /(leverage|synergy|best-in-class)/i.test(r) && /(assessment|overall)/i.test(r),
    },
    {
      input: `Brand voice guide — Client: Nimbus Cloud, dev-tool brand. Tone: technical, peer-to-peer, never condescending. Audience: senior engineers.
Draft copy:
L1: "Even non-techies can deploy in one click — it's that easy!"
L2: "Ship to production with a single command."
Review the lines against the guide.`,
      expected: (r: string) =>
        /(condescend|non-techies|tone)/i.test(r) && /(rewrite|suggest)/i.test(r),
    },
    {
      input: `Please review this draft tagline for our client and tell me if it's on-brand: "Bold moves, brighter futures." We're a consumer energy company. (No brand voice guide attached.)`,
      expected: (r: string) =>
        /(brand guide|guide|provide|ask|cannot|can't)/i.test(r),
    },
  ],
}
