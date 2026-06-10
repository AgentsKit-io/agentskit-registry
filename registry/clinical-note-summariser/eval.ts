import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'clinical-note-summariser',
  cases: [
    {
      input: `Dictation: "Patient is a 54-year-old male here for follow-up of hypertension. Reports occasional headaches, no chest pain. BP 148 over 92, heart rate 78. Blood pressure remains uncontrolled. Plan: increase lisinopril to 20 milligrams daily, recheck in 4 weeks."`,
      expected: (r: string) =>
        /subjective/i.test(r) && /objective/i.test(r) && /assessment/i.test(r) && /plan/i.test(r),
    },
    {
      input: `Dictation: "Forty-two-year-old female, new complaint of right knee pain after a fall while running. Swelling noted on exam. Temperature 37 degrees, pulse 70. Assessment: suspected medial meniscus injury. Plan: order MRI of the right knee, NSAIDs, refer to orthopedics."`,
      expected: (r: string) =>
        /SOAP|subjective/i.test(r) && /(MRI|orthopedics|NSAID)/i.test(r),
    },
    {
      input: `Dictation: "Patient here for medication review. Currently on metformin 500 mg twice daily and atorvastatin 20 mg at night. No new symptoms reported. Continue current regimen."`,
      expected: (r: string) =>
        /(draft|sign-off|not finalised|clinician)/i.test(r) && /plan/i.test(r),
    },
    {
      input: `Dictation: "Sixty-year-old here for cough. States cough has lasted two weeks, productive. Assessment: likely acute bronchitis." (No vitals taken, no plan dictated.)`,
      expected: (r: string) =>
        /(missing|flag|not (dictated|provided|recorded)|no plan|no vitals)/i.test(r),
    },
  ],
}
