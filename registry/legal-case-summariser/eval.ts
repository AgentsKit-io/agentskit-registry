import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-case-summariser',
  cases: [
    {
      input: `Produce a court-ready matter summary from these reviewed documents and reviewer notes. DOC-001: Complaint, Hawthorne Mfg. v. Delta Supply Co., filed 2023-02-01 in S.D.N.Y. Plaintiff counsel: R. Singh (Singh LLP). Defendant counsel: T. Brooks (Brooks & Hale). DOC-014: Reviewer note — "MSA executed 2021-11-05; Delta missed three delivery milestones (Q2-Q4 2022)." DOC-022: Order on motion to compel, entered 2023-08-19. Open issue per reviewer: damages model not yet produced.`,
      expected: (r: string) =>
        /hawthorne/i.test(r) && /delta supply/i.test(r) && /(posture|order|motion)/i.test(r) && /DOC-0\d\d/i.test(r),
    },
    {
      input: `Summarize this matter for the supervising attorney. DOC-100 (deposition transcript) says the contract was signed on 2022-04-01. DOC-205 (executed agreement PDF) shows a signature date of 2022-06-15. The reviewer notes flag this discrepancy. Produce the summary and address the conflicting dates.`,
      expected: (r: string) =>
        /(conflict|inconsisten|discrepan|differ)/i.test(r) && /(2022-04-01|2022-06-15|april|june)/i.test(r),
    },
    {
      input: `Build a key-facts section with citations. DOC-301: invoice dated 2023-05-02 for $84,000. DOC-302: payment record showing $40,000 wired 2023-06-10. DOC-303: demand letter dated 2023-08-01 claiming $44,000 outstanding. Cite each underlying document ID.`,
      expected: (r: string) =>
        /DOC-30\d/i.test(r) && /(\$84,?000|\$44,?000|\$40,?000|outstanding|balance)/i.test(r),
    },
    {
      input: `Summarize this matter. The only material provided is a one-line reviewer note: "Saw something about a lawsuit, not sure which parties or court." No document IDs, no parties, no procedural history are supplied.`,
      expected: (r: string) =>
        /(open issue|flag|missing|not provided|insufficient|cannot|unable|escalat|attorney)/i.test(r),
    },
  ],
}
