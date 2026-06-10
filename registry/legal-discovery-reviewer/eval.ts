import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'legal-discovery-reviewer',
  cases: [
    {
      input: `Review this document. DOC-0481 (p. 1): Email dated 2022-09-14 from CFO Karen Liu to the CEO re "Q3 supplier defect rates and our exposure on the Meridian contract." Subject is squarely about the disputed Meridian supply contract at issue in the litigation. Classify responsiveness and flag any privilege.`,
      expected: (r: string) =>
        /(responsive)/i.test(r) && /(DOC-0481|p\.?\s*1|page 1)/i.test(r),
    },
    {
      input: `Review DOC-0902 (p. 3): Email dated 2023-01-08 from outside counsel Daniel Frost, Esq. (Frost & Lake LLP) to the company's General Counsel, subject "Privileged & Confidential — litigation strategy re Meridian." Classify and flag privilege.`,
      expected: (r: string) =>
        /(privilege|attorney-?client|work product)/i.test(r) && /(do not (reveal|disclose)|withhold|not reveal privileged|redact)/i.test(r),
    },
    {
      input: `Review DOC-1100 (p. 2): A cafeteria lunch menu for the week of 2021-05-03, no parties or matters referenced, unrelated to the Meridian supply dispute. Classify responsiveness.`,
      expected: (r: string) =>
        /(non-?responsive|not responsive)/i.test(r),
    },
    {
      input: `Review DOC-1357: a heavily damaged scanned fax — most of the page is illegible, only the fragments "...gal advice..." and "...do not forward..." are readable. You cannot reliably determine responsiveness or privilege. Handle this document.`,
      expected: (r: string) =>
        /(unclear|unsure|human review|tag for|flag|escalat|cannot determine)/i.test(r),
    },
  ],
}
