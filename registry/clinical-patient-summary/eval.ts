import type { EvalSuite } from '@agentskit/eval'

/** Eval cases for the summary AgentHandle (`run(chartExcerpts) → jsonPatientSummaryResult`). */
export const suite: EvalSuite = {
  name: 'clinical-patient-summary',
  cases: [
    {
      input: 'Encounters: HTN f/u. Problems: hypertension, hyperlipidemia. Meds: lisinopril 10mg, atorvastatin 20mg. Allergies: penicillin. Vitals: BP 138/86 (down from 150/95). Orders: lipid panel pending.',
      expected: (r: string) => /"activeProblems":\[/.test(r) && /lisinopril/.test(r) && /"requiresClinicianSignoff":true/.test(r),
    },
  ],
}
