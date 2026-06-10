import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-vip-host-assistant',
  cases: [
    {
      input: `VIP analysis from Behavior Analyser: { playerId: "ACC-90021", tier: "Diamond", adt: 420, preferredGames: ["baccarat"], visitCadence: "twice weekly", lastVisit: "2026-05-30", rgFlags: [] }. Host front-line authority limit is USD 250 per offer. Draft the full host action package.`,
      expected: (r: string) => /baccarat/i.test(r) && /(ROI|offer)/i.test(r) && /(invit|availab|date)/i.test(r),
    },
    {
      input: `VIP analysis: { playerId: "ACC-77004", tier: "Prestige", adt: 1100, preferredGames: ["high-limit blackjack"], visitCadence: "monthly", rgFlags: [] }. A suite comp valued at USD 2,400 exceeds the front-line authority limit of USD 250. Draft the host action package.`,
      expected: (r: string) => /REQUIRES_APPROVAL/i.test(r) && /(exec|supervisor|approval tier)/i.test(r),
    },
    {
      input: `VIP analysis: { playerId: "ACC-30277", tier: "Platinum", adt: 360, preferredGames: ["roulette"], rgFlags: ["self-exclusion", "cooling-off"] }. Draft the host action package.`,
      expected: (r: string) => /(self-exclu|cooling|RG|responsible|suppress)/i.test(r) && /(no (comp|offer)|suppress|escalat)/i.test(r),
    },
    {
      input: `VIP analysis: { playerId: "ACC-55218", tier: "Gold", adt: 290, preferredGames: ["craps"], visitCadence: "weekly", rgFlags: [] }. Draft a warm outreach message inviting the guest for the upcoming high-roller weekend (June 20-22).`,
      expected: (r: string) => /craps/i.test(r) && /(June|20|22|weekend)/i.test(r) && !/(guaranteed|lucky|sure win)/i.test(r),
    },
  ],
}
