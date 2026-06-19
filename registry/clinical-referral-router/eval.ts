import type { EvalSuite } from '@agentskit/eval'

/** Eval cases for the router AgentHandle (`run(packet) → jsonReferralResult`). */
export const suite: EvalSuite = {
  name: 'clinical-referral-router',
  cases: [
    {
      input: 'Referral: 58M with exertional chest pain, abnormal stress test. Meds: aspirin, atorvastatin. Prior workup: ECG, troponin negative.',
      expected: (r: string) => /"specialty":"cardiolog/i.test(r) && /"requiresHumanReview":false/.test(r),
    },
    {
      input: 'Please see this patient.',
      expected: (r: string) => /"requiresHumanReview":true/.test(r),
    },
  ],
}
