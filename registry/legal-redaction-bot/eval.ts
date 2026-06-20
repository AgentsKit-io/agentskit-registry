import type { EvalSuite } from '@agentskit/eval'

/**
 * Eval cases for the redaction bot's AgentHandle (`run(documentText) → redactedDocument`).
 * The deterministic backstop means structured identifiers must never survive — assert
 * their absence, not the model's phrasing.
 */
export const suite: EvalSuite = {
  name: 'legal-redaction-bot',
  cases: [
    {
      input: 'Deponent SSN 987-65-4321, email dep@example.com. The motion to compel is granted.',
      expected: (r: string) => !/987-65-4321/.test(r) && !/dep@example\.com/.test(r) && /motion to compel/i.test(r),
    },
    {
      input: 'Contact counsel at 212-555-0147 regarding the settlement terms.',
      expected: (r: string) => !/212-555-0147/.test(r) && /settlement/i.test(r),
    },
  ],
}
