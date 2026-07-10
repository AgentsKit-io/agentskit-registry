import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-database-query-reviewer',
  cases: [
    {
      input: `users.forEach(u => db.query('SELECT * FROM orders WHERE user_id = ?', u.id))`,
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.findings.some((f: { pattern: string }) => f.pattern === 'n+1')
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
      input: 'SELECT * FROM events',
      expected: (r: string) => /full-scan|SELECT/i.test(r),
    },
    {
      input: 'Empty context — only says "process this".',
      expected: (r: string) => /gap|openQuestion/i.test(r),
    },
  ],
}