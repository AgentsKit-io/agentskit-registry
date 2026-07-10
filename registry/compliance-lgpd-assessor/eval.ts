import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'compliance-lgpd-assessor',
  cases: [
    {
      input: 'We process emails for marketing using consent checkbox on signup. No DPO appointed yet.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.findings.some((f: { message: string }) => /consent|Art\.?\s*7/i.test(f.message)) || j.gaps.length > 0
      },
    },
    {
      input: 'Security breach exposed 10k customer CPF numbers last week.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.findings.some((f: { severity: string; article?: string }) => f.severity === 'critical' && /48|breach|vazamento|incidente/i.test(`${f.article} ${f.message}`))
      },
    },
    {
      input: 'Minimal input.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.gaps.length > 0 || j.findings.length === 0
      },
    },
    {
      input: 'App collects child birthdays for a school portal without parental flow described.',
      expected: (r: string) => /Art\.?\s*14|menor|child|criança/i.test(r),
    },
  ],
}