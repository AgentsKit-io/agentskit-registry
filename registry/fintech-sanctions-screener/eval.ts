import type { EvalSuite } from '@agentskit/eval'

/**
 * Eval cases for the screener's AgentHandle (`run(jsonCandidate) → jsonScreeningResult`).
 * Wire the agent under test with a list containing 'Vladimir Putin' / 'Kim Jong Un'.
 * The deterministic gate means most outcomes don't depend on the model at all.
 */
export const suite: EvalSuite = {
  name: 'fintech-sanctions-screener',
  cases: [
    {
      // Exact name on the list → escalate, sign-off required, never auto-cleared.
      input: JSON.stringify({ name: 'Vladimir Putin', country: 'RU' }),
      expected: (r: string) => /"status":"escalate"/.test(r) && /"requiresHumanSignoff":true/.test(r),
    },
    {
      // Unrelated party → clear, no hits.
      input: JSON.stringify({ name: 'Emily R. Carter', dob: '1994-05-21', country: 'CA' }),
      expected: (r: string) => /"status":"clear"/.test(r),
    },
    {
      // Second list member, exact → escalate.
      input: JSON.stringify({ name: 'Kim Jong Un', country: 'KP' }),
      expected: (r: string) => /"status":"escalate"/.test(r),
    },
  ],
}
