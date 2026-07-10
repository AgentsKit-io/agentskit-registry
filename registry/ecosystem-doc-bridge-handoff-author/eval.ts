import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecosystem-doc-bridge-handoff-author',
  cases: [
    {
      input: `package: auth
agent doc: packages/auth.md
editRoot: packages/auth
checks: npm test --workspace @app/auth
human adapter linked at docs/auth/overview.md`,
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.handoff?.type === 'agent-handoff' && j.handoff.target.id === 'auth' && j.handoff.startHere.includes('auth')
      },
    },
    {
      input: 'Minimal input.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return (j.handoff === null || j.gaps.length > 0) && j.requiresReview === true
      },
    },
    {
      input: 'Target package runtime — start at packages/runtime.md, edit packages/runtime only.',
      expected: (r: string) => /runtime/i.test(r) && (/agent-handoff|gap/i.test(r)),
    },
    {
      input: 'Empty context — only says "process this".',
      expected: (r: string) => /gap|openQuestion/i.test(r) && /requiresReview":true/.test(r),
    },
  ],
}