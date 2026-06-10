import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'coding-issue-creator',
  cases: [
    {
      input: `PRD JSON: {"problem":"Users cannot reset passwords","criteria":["Add a POST /auth/reset endpoint that emails a one-time token","Token expires after 15 minutes and is single-use","Rate-limit reset requests to 5 per hour per email"]}. Create the GitHub issues.`,
      expected: (r: string) => /enhancement/i.test(r) && /(definition of done|\bDoD\b|checklist|- \[ \])/i.test(r),
    },
    {
      input: `PRD JSON: {"problem":"Search returns stale results","criteria":["Fix the cache invalidation bug so updated documents appear within 2 seconds"]}. Create the GitHub issue.`,
      expected: (r: string) => /bug/i.test(r) && /automated/i.test(r),
    },
    {
      input: `PRD JSON: {"criteria":["Implement OAuth2 PKCE login flow for the mobile client including token refresh, secure storage of the refresh token, and graceful handling of revoked tokens across app restarts and network failures"]}. Create the issue; the criterion is over 80 characters so set the title accordingly.`,
      expected: (r: string) => /title/i.test(r) && /(80|truncat)/i.test(r),
    },
    {
      input: `PRD JSON: {"problem":"Dashboard is slow","criteria":[]}. The acceptance criteria array is empty. Create the issues.`,
      expected: (r: string) => /(no (criteria|criterion)|empty|cannot|nothing to|missing|need|escalat)/i.test(r),
    },
  ],
}
