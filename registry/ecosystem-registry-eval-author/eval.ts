import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecosystem-registry-eval-author',
  cases: [
    {
      input: 'Agent: legal-doc-reviewer. Pain: contract risk review. Output: findings array with severity.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.cases.length >= 2 && j.cases.every((c: { input: string; expectedDescription: string }) => c.input && c.expectedDescription)
      },
    },
    {
      input: 'Minimal input.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.cases.length >= 1 || j.gaps.length > 0
      },
    },
    {
      input: 'Agent handles LGPD consent audits — must reject missing consent records.',
      expected: (r: string) => /consent|LGPD|gap/i.test(r),
    },
    {
      input: 'Empty context — only says "process this".',
      expected: (r: string) => /gap|openQuestion|cases/i.test(r),
    },
  ],
}