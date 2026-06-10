import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-release-notes-drafter',
  cases: [
    {
      input: `Merged PRs since v2.3.0:
#412 "feat(auth): add passkey login" labels: [feature]
#418 "fix(billing): correct proration rounding" labels: [bug]
#421 "perf(search): cache tokenizer results" labels: [performance]
#425 "chore(ci): bump node to 20" labels: [internal]
Draft the release notes.`,
      expected: (r: string) => /feature/i.test(r) && /fix/i.test(r) && /#412/.test(r) && /#418/.test(r),
    },
    {
      input: `Merged PRs since v1.0.4:
#88 "docs: rewrite the getting-started guide" labels: [docs]
#90 "fix(api): handle empty pagination cursor" labels: [bug]
Draft the release notes grouping by change type.`,
      expected: (r: string) => /docs/i.test(r) && /fix/i.test(r) && /#88/.test(r) && /#90/.test(r),
    },
    {
      input: `Merged PRs since v5.1.0:
#1203 "feat(export): CSV export for reports" labels: [feature]
#1205 "feat(export): XLSX export for reports" labels: [feature]
#1210 "refactor(core): split adapter module" labels: [internal]
Draft notes; lead with user-facing changes within each group.`,
      expected: (r: string) => /feature/i.test(r) && /(internal)/i.test(r) && /#1203/.test(r),
    },
    {
      input: `Draft release notes for v3.0.0. No merged PR list was provided — the input contains only the tag name. Proceed.`,
      expected: (r: string) => /(no (pr|merge)|empty|cannot|nothing|missing|need|provide|escalat)/i.test(r),
    },
  ],
}
