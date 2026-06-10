import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'clinical-chart-redactor',
  cases: [
    {
      input: `Redact this chart before cross-tenant export:
Patient: Maria Gonzalez, MRN 884213, DOB 03/14/1971.
Admitted 2026-05-02. Phone (415) 555-0192. Email maria.g@example.com.
Assessment: Type 2 diabetes, A1c 8.4%. Medications: metformin 1000mg BID, lisinopril 10mg daily.`,
      expected: (r: string) =>
        /redact/i.test(r) && /metformin|lisinopril|a1c|diabetes/i.test(r),
    },
    {
      input: `Export this discharge note. Produce the redacted chart plus a redaction log:
"Mr. James Whitfield (MRN 0091235) seen with his daughter Sarah Whitfield. DOB 11/02/1958. Contact: 312-555-7788. Findings: stable angina, troponin negative. Plan: aspirin 81mg daily."`,
      expected: (r: string) =>
        /redaction log/i.test(r) && /(MRN|name|date of birth|DOB|contact)/i.test(r),
    },
    {
      input: `Redact for export:
Patient John Park, MRN 77231, DOB 1990-06-22. Iris biometric scan on file. Full-face clinical photo attached. Chest X-ray shows no acute infiltrate.`,
      expected: (r: string) =>
        /redact/i.test(r) && /biometric|photo|full-face/i.test(r),
    },
    {
      input: `Redact this chart. It contains the patient's tribal enrollment number and a tattoo-pattern identifier — neither is in the standard HIPAA-strict list. Redacted chart: name Lee Tran, MRN 55021, hypertension, amlodipine 5mg.`,
      expected: (r: string) =>
        /(clarif|refuse|cannot|not.*cover|unsure|escalat)/i.test(r),
    },
  ],
}
