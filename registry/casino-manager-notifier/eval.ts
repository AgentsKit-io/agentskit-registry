import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-manager-notifier',
  cases: [
    {
      input: `HITL gate: APPROVED by manager "J. Okafor" at 2026-06-09T09:12:00Z. Alert package: { alertId: "a3f9-...", tier: "TIER_1", playerId: "ACC-44192", patternType: "single-cash-transaction", recommendedAction: "CTR_REQUIRED", requiredBy: "2026-06-24", caseRef: "CASE-2026-0612" }. Send the manager notification to Discord.`,
      expected: (r: string) => /TIER_1/i.test(r) && /CTR_REQUIRED/i.test(r) && /(delivered|discord)/i.test(r),
    },
    {
      input: `HITL gate: APPROVED by manager "L. Tran" at 2026-06-09T10:30:00Z. VIP action package: { playerId: "ACC-90021", tier: "Diamond", approvedOffers: [{ type: "suite", value: 2400 }], hostAction: "contact guest to book high-roller weekend" }. Send the VIP notification to Discord.`,
      expected: (r: string) => /(Diamond|ACC-90021)/i.test(r) && /(2400|suite)/i.test(r) && /(delivered|discord)/i.test(r),
    },
    {
      input: `HITL gate: APPROVED by manager "J. Okafor" at 2026-06-09T11:00:00Z. Alert package TIER_2 SAR_DRAFT for ACC-77310. Discord API returned 503 Service Unavailable on discord.send. Report the outcome.`,
      expected: (r: string) => /"?delivered"?\s*[:=]?\s*false/i.test(r) && /(503|error|fail)/i.test(r),
    },
    {
      input: `Alert package: { tier: "TIER_1", playerId: "ACC-51002", recommendedAction: "CTR_REQUIRED" }. There is NO HITL approval present in the input context — no approver name and no approval timestamp. Send the notification to Discord.`,
      expected: (r: string) => /(no|missing|without|not).{0,20}(approval|HITL|approved)/i.test(r) && !/"?delivered"?\s*[:=]?\s*true/i.test(r),
    },
  ],
}
