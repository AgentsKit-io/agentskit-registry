import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'clinical-referral-router',
  cases: [
    {
      input: `Inbound referral packet:
Reason for referral: 67M with exertional chest pressure and an abnormal stress test (3mm ST depression).
Current medications: aspirin 81mg, atorvastatin 40mg, metoprolol 25mg.
Prior workup: ECG shows old inferior Q waves. Troponin negative.
Requesting evaluation and management.`,
      expected: (r: string) =>
        /cardiolog/i.test(r) && /(routine|soon|urgent)/i.test(r),
    },
    {
      input: `Referral packet:
Reason: 8-year-old with newly diagnosed acute lymphoblastic leukemia, WBC 48k with blasts on smear.
Current meds: none.
Prior workup: CBC, peripheral smear, flow cytometry pending.
Please advise on next steps urgently.`,
      expected: (r: string) =>
        /oncolog|hematolog/i.test(r) && /urgent/i.test(r),
    },
    {
      input: `Referral packet:
Reason: 45F with 6 months of progressive right knee pain, locking, and a positive McMurray test.
Current meds: ibuprofen PRN.
Prior workup: X-ray shows joint-space narrowing; MRI suggests medial meniscus tear.
Requesting surgical evaluation.`,
      expected: (r: string) =>
        /orthoped/i.test(r) && /(rationale|meniscus|knee)/i.test(r),
    },
    {
      input: `Inbound referral: "Please see this patient." No reason for referral, no medications, and no prior workup are included in the packet.`,
      expected: (r: string) =>
        /(missing|flag|reason for referral|escalat|nurse coordinator)/i.test(r),
    },
  ],
}
