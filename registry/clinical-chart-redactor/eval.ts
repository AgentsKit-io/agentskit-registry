import type { EvalSuite } from '@agentskit/eval'

/**
 * Eval cases for the redactor's AgentHandle (`run(chartText) → redactedChart`).
 * The deterministic backstop means structured identifiers (email/SSN/phone) must
 * never appear in the output — assert their absence, not the model's phrasing.
 */
export const suite: EvalSuite = {
  name: 'clinical-chart-redactor',
  cases: [
    {
      input: 'Patient John Doe, SSN 123-45-6789, email john@doe.com. Assessment: stable angina, continue aspirin.',
      // No structured PII may survive; clinical content preserved.
      expected: (r: string) => !/123-45-6789/.test(r) && !/john@doe\.com/.test(r) && /angina/i.test(r),
    },
    {
      input: 'Follow-up call to 555-867-5309 scheduled. Plan: titrate metoprolol.',
      expected: (r: string) => !/555-867-5309/.test(r) && /metoprolol/i.test(r),
    },
  ],
}
