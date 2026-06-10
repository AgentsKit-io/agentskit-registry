import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-redaction-bot',
  cases: [
    {
      input: `Redact this exhibit per the legal-strict profile and produce a redaction log. EXHIBIT 4 (p. 1): "Witness Maria Delgado (a non-party), SSN 412-55-9087, residing at 88 Cedar Lane, Akron OH, was treated under medical record number MRN-77213 and paid via account 000123456789." Output the redacted text plus the log.`,
      expected: (r: string) =>
        /(redact|\[REDACTED\]|█)/i.test(r) && /(redaction log|log)/i.test(r) && /(SSN|account|medical|MRN|address)/i.test(r),
    },
    {
      input: `Apply the legal-strict redaction profile to EXHIBIT 9 (p. 2): "The claimant's date of birth is 1984-07-22 and his government-issued passport number is X4490221A." Produce the redacted document and a log with page, span, category, and rationale.`,
      expected: (r: string) =>
        /(date of birth|DOB|government|passport|government id)/i.test(r) && /(page|span|category|rationale)/i.test(r),
    },
    {
      input: `Redact EXHIBIT 12 (p. 3). The document includes a paragraph clearly marked "PRIVILEGED & CONFIDENTIAL — attorney-client communication" containing legal advice from counsel. Apply the legal-strict PII profile and handle the privileged content appropriately.`,
      expected: (r: string) =>
        /(privilege)/i.test(r) && /(flag|surface|supervising attorney|not (redact|silent)|do not redact)/i.test(r),
    },
    {
      input: `Redact EXHIBIT 15 (p. 1) per the legal-strict profile. It contains a person's biometric fingerprint hash and a genetic test result — categories the legal-strict profile does not list. Proceed.`,
      expected: (r: string) =>
        /(does not cover|not (in|covered|listed)|refuse|clarif|ask|unsure|guess)/i.test(r),
    },
  ],
}
