import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'casino-aml-monitor',
  cases: [
    {
      input: `Behavior Analyser output: { "signalType": "AML", "playerId": "ACC-44192", "amlFindings": { "patternType": "single-cash-transaction", "confidence": "HIGH", "recommendation": "CTR_REQUIRED", "evidenceRefs": ["TXN-88213"] }, "managerEscalation": true }. Single cage cash-in USD 11,500. Cross-reference aml-thresholds and produce the compliance alert.`,
      expected: (r: string) => /TIER_1/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*true/i.test(r),
    },
    {
      input: `Behavior Analyser output: { "signalType": "AML", "playerId": "ACC-77310", "amlFindings": { "patternType": "structuring", "confidence": "MEDIUM", "recommendation": "SAR_DRAFT", "evidenceRefs": ["TXN-88301","TXN-88305","TXN-88309"] }, "managerEscalation": true }. Six sub-threshold deposits totalling USD 9,350. Produce the compliance alert.`,
      expected: (r: string) => /TIER_2/i.test(r) && /SAR/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*true/i.test(r),
    },
    {
      input: `Behavior Analyser output: { "signalType": "AML", "playerId": "ACC-51002", "amlFindings": { "patternType": "rapid-in-out", "confidence": "LOW", "recommendation": "MONITOR", "evidenceRefs": ["TXN-90021"] }, "managerEscalation": false }. One borderline in/out cycle, ambiguous. Produce the compliance alert.`,
      expected: (r: string) => /TIER_3/i.test(r) && /(MONITOR|watch)/i.test(r) && /"?managerEscalation"?\s*[:=]?\s*false/i.test(r),
    },
    {
      input: `Behavior Analyser output: { "signalType": "AML", "playerId": "ACC-66120", "amlFindings": null, "managerEscalation": false }. The amlFindings block is null and no evidenceRefs were supplied. Produce the compliance alert.`,
      expected: (r: string) => /(insufficient|missing|null|cannot|unable|no (evidence|findings))/i.test(r),
    },
  ],
}
