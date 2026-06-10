import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-behavior-analyser',
  cases: [
    {
      input: `Classified signal { signalType: "AML", playerId: "ACC-77310" }. 90-day history shows 6 cash-ins of USD 3,000-3,400 each across 3 days, always just under the CTR threshold, same patron, no offsetting play. Cross-reference aml-thresholds and behavior-red-flags. Produce the risk assessment JSON.`,
      expected: (r: string) => /structur/i.test(r) && /(SAR_DRAFT|CTR_REQUIRED)/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*true/i.test(r),
    },
    {
      input: `Classified signal { signalType: "AML", playerId: "ACC-44192" }. History: a single cage cash-in of USD 11,500, valid ID on file, normal table play afterward. Cross-reference aml-thresholds. Produce the risk assessment JSON.`,
      expected: (r: string) => /CTR_REQUIRED/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*true/i.test(r),
    },
    {
      input: `Classified signal { signalType: "VIP", playerId: "ACC-90021" }. Tier Diamond, ADT USD 420, prefers baccarat, visits twice weekly, no responsible-gambling flags. Use vip-segments and bonus-eligibility-rules RAG. Produce the risk assessment JSON with the best comp offers.`,
      expected: (r: string) => /VIP/i.test(r) && /offers/i.test(r),
    },
    {
      input: `Classified signal { signalType: "VIP", playerId: "ACC-30277" }. Tier Platinum, ADT USD 360, but the player appears on the self-exclusion list with an active cooling-off period. Produce the risk assessment JSON.`,
      expected: (r: string) => /(self-exclu|cooling|rgFlag|responsible)/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*true/i.test(r),
    },
  ],
}
