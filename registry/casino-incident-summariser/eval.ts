import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-incident-summariser',
  cases: [
    {
      input: `Raw notes — Security log 2026-06-08 23:47, Pit 4 (high-limit baccarat). Supervisor account: patron ACC-44192 became loud after a losing hand, knocked over a chip tray. Surveillance ref CAM-PIT4-2347. Floor host ACC-STAFF-118 de-escalated; patron escorted to lobby. No injuries reported. Draft the incident report.`,
      expected: (r: string) => /ACC-44192/i.test(r) && /(Pit 4|baccarat)/i.test(r) && /(CAM-PIT4-2347|evidence)/i.test(r),
    },
    {
      input: `Raw notes — Surveillance log: at approx 02:10 a male patron (internal id ACC-71200) was observed at the cage. Supervisor states he "seemed to be passing chips to another guest" but no camera angle confirmed this. Cage clerk ACC-STAFF-204 logged the redemption. Draft the incident report.`,
      expected: (r: string) => /unconfirmed/i.test(r) && /ACC-71200/i.test(r),
    },
    {
      input: `Raw notes — 2026-06-09 14:05, slot bank S-22. Player ACC-88090 reported a malfunctioning machine that did not credit a USD 600 ticket. Tech ACC-STAFF-330 inspected, ref WO-S22-0609, confirmed bill-validator jam, ticket reissued. Surveillance CAM-SLOT-22 reviewed. Draft the incident report.`,
      expected: (r: string) => /(S-22|slot)/i.test(r) && /(WO-S22-0609|CAM-SLOT-22)/i.test(r) && /follow.?up/i.test(r),
    },
    {
      input: `Raw notes: "Something happened on the floor last night, a guest was upset and security got involved." No time, location, internal ids, or evidence references provided. Draft the incident report.`,
      expected: (r: string) => /unconfirmed/i.test(r) && /(missing|not provided|unknown|no (time|location|id|evidence))/i.test(r),
    },
  ],
}
