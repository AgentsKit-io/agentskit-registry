import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-case-analyst',
  cases: [
    {
      input: `Analyze this case file. COMPLAINT (Dkt. 1, filed 2023-03-14, N.D. Cal.): Acme Robotics Inc. ("Plaintiff", counsel: Jane Patel, Patel & Voss LLP) v. Nimbus Cloud Systems LLC ("Defendant", counsel: Marc Oye, Oye Legal). Claims: (1) breach of the Master Services Agreement dated 2021-06-01, (2) misappropriation of trade secrets under the DTSA. ANSWER (Dkt. 22, filed 2023-04-30): general denial, affirmative defenses of waiver and unclean hands. Plaintiff served First Set of Requests for Production (Ex. C, p. 4) on 2023-05-10.`,
      expected: (r: string) =>
        /acme robotics/i.test(r) && /nimbus cloud/i.test(r) && /(N\.D\.\s*Cal|northern district|jurisdiction|venue)/i.test(r) && /(claim|breach|trade secret)/i.test(r),
    },
    {
      input: `Produce a structured analysis. The accident occurred 2020-08-02. The personal-injury complaint was filed 2023-09-15 in California state court. California's statute of limitations for personal injury is two years. Parties: Lena Ortiz (plaintiff) v. Brightline Transit Authority (defendant). Identify any filing-deadline or limitations risk.`,
      expected: (r: string) =>
        /(statute of limitations|limitations|deadline|time-barred|untimely)/i.test(r) && /(risk|2 year|two year)/i.test(r),
    },
    {
      input: `Extract procedural posture and key dates from this docket. Dkt. 1 Complaint filed 2024-01-10. Dkt. 15 Motion to Dismiss filed 2024-02-20. Dkt. 31 Order granting in part / denying in part MTD, entered 2024-05-03. Dkt. 40 Amended Complaint filed 2024-05-24. Case is now in discovery; fact-discovery cutoff is 2024-11-30.`,
      expected: (r: string) =>
        /(procedural posture|posture|discovery|motion to dismiss)/i.test(r) && /2024/.test(r),
    },
    {
      input: `Analyze the parties, jurisdiction, and venue for this matter. The only document provided is a single email reading: "Hi team, please pull the file when you get a chance. Thanks." There are no pleadings, no caption, and no party names in the record.`,
      expected: (r: string) =>
        /not in record/i.test(r),
    },
  ],
}
