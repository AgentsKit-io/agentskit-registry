import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecosystem-registry-agent-spec-author',
  cases: [
    {
      input: 'Idea: HR agent that screens resumes for role fit without bias. Category: hr.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.pain && j.output && j.gates.includes('typed-output') && j.zodOutline.length > 10
      },
    },
    {
      input: 'Minimal input.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.gaps.length > 0 || (j.pain && j.output)
      },
    },
    {
      input: 'Fintech SAR drafter for suspicious activity reports in Brazil.',
      expected: (r: string) => /SAR|suspicious|fintech/i.test(r),
    },
    {
      input: 'Empty context — only says "process this".',
      expected: (r: string) => /gap|openQuestion/i.test(r),
    },
  ],
}