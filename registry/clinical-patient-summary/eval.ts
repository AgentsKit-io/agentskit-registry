import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'clinical-patient-summary',
  cases: [
    {
      input: `Draft a one-page pre-visit summary from these chart excerpts:
Reason for visit: 3-month diabetes follow-up.
Problem list: Type 2 diabetes, hypertension, obesity, GERD, osteoarthritis.
Medications: metformin 1000mg BID, lisinopril 10mg daily, omeprazole 20mg daily.
Allergies: penicillin (rash).
Latest vitals: BP 138/86, weight 102kg (was 105kg 3mo ago). A1c 7.9% (was 8.6%).
Outstanding orders: foot exam, retinal screening due.`,
      expected: (r: string) =>
        /(active problems|problem)/i.test(r) && /allerg/i.test(r) && /(follow-up|outstanding|order)/i.test(r),
    },
    {
      input: `Pre-visit summary please. Excerpts:
Reason: post-op knee replacement check.
Problems: right TKA 2026-04-10, atrial fibrillation, CKD stage 3.
Meds: apixaban 5mg BID, metoprolol 25mg BID.
Allergies: none documented.
Vitals: BP 124/78, HR 68.
Open questions: confirm anticoagulation plan with cardiology.`,
      expected: (r: string) =>
        /(reason for visit|reason)/i.test(r) && /(open question|cardiology|anticoagulation)/i.test(r),
    },
    {
      input: `Summarize for the upcoming visit:
Reason: annual physical.
Problems: hypothyroidism, anxiety.
Meds: levothyroxine 75mcg daily, sertraline 50mg daily.
Allergies: sulfa drugs.
Vitals: BP 118/74, HR 72, BMI 24.`,
      expected: (r: string) =>
        /(draft|confirm)/i.test(r) && /(levothyroxine|hypothyroidism|sertraline)/i.test(r),
    },
    {
      input: `Pre-visit summary. Excerpts provided:
Reason: chest pain workup follow-up.
Problems: chest pain NYD.
Medications: (no medication list in chart).
Allergies: (not documented).
Vitals: (no recent vitals in chart).`,
      expected: (r: string) =>
        /not in chart/i.test(r),
    },
  ],
}
