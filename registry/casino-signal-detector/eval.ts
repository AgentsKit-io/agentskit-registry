import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-signal-detector',
  cases: [
    {
      input: `Raw CMS signal: { rawSignalRef: "TXN-88213", playerId: "ACC-44192", type: "cage", events: [{ kind: "cash-in", amount: 11500, currency: "USD", ts: "2026-06-08T21:14:00Z" }] }. Single cage cash-in of USD 11,500 in one session. Classify.`,
      expected: (r: string) => /"?signalType"?\s*[:=]?\s*"?AML/i.test(r),
    },
    {
      input: `Raw CMS signal: { rawSignalRef: "TXN-88301", playerId: "ACC-77310", type: "kiosk", events: [{ kind: "cash-in", amount: 3200, ts: "2026-06-09T01:02:00Z" }, { kind: "cash-in", amount: 3100, ts: "2026-06-09T03:40:00Z" }, { kind: "cash-in", amount: 3050, ts: "2026-06-09T07:55:00Z" }] }. Three sub-threshold cash-ins totalling USD 9,350 within a 24h window. Classify.`,
      expected: (r: string) => /AML/i.test(r) && /structur/i.test(r),
    },
    {
      input: `Raw CMS signal: { rawSignalRef: "VIP-5521", playerId: "ACC-90021", type: "player-activity", sessionTheo: 740, segment: "Diamond", preferredGame: "baccarat" }. Session theoretical win USD 740, Diamond segment, no cash-threshold triggers. Classify.`,
      expected: (r: string) => /"?signalType"?\s*[:=]?\s*"?VIP/i.test(r),
    },
    {
      input: `Raw CMS signal: { rawSignalRef: "TXN-90555", type: "table-buy-in" }. The playerId and amount fields are missing entirely. Classify this signal.`,
      expected: (r: string) => /ERROR/i.test(r) && /(playerId|amount|missing|field)/i.test(r),
    },
  ],
}
