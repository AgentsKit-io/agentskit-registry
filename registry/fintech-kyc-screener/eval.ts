import type { EvalSuite } from '@agentskit/eval'

/**
 * Eval cases for the KYC screener's AgentHandle (`run(jsonCandidate) → jsonKycResult`).
 * Wire the agent under test with a list containing 'Vladimir Putin' (PEP). The
 * deterministic gate + required-field check mean most outcomes don't depend on the model.
 */
export const suite: EvalSuite = {
  name: 'fintech-kyc-screener',
  cases: [
    {
      // Required field missing → refuse, escalate, report the field.
      input: JSON.stringify({ name: 'Jane Doe', dob: '', country: 'US' }),
      expected: (r: string) => /"missing":\[/.test(r) && /dob/.test(r) && /"riskTier":"escalate"/.test(r),
    },
    {
      // Exact PEP hit → escalate, sign-off.
      input: JSON.stringify({ name: 'Vladimir Putin', dob: '1952-10-07', country: 'RU' }),
      expected: (r: string) => /"riskTier":"escalate"/.test(r) && /"requiresHumanSignoff":true/.test(r),
    },
    {
      // Clean identity → clear.
      input: JSON.stringify({ name: 'Robert Brown', dob: '1990-03-03', country: 'CA' }),
      expected: (r: string) => /"riskTier":"clear"/.test(r),
    },
  ],
}
