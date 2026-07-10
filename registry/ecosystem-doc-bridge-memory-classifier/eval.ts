import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecosystem-doc-bridge-memory-classifier',
  cases: [
    {
      input: 'Note: package auth owns session refresh. Always forward AbortSignal in handlers.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.candidates?.some((c: { route: string }) => /promote|hold/i.test(c.route))
      },
    },
    {
      input: 'Scratch: ignore this todo about lunch.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.candidates?.every((c: { route: string }) => c.route === 'reject')
      },
    },
    {
      input: 'api_key=sk-test-12345 stored in .env.local',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.candidates?.every((c: { route: string; safetyFlags: string[] }) =>
          c.route === 'reject' && c.safetyFlags.includes('secret-pattern'),
        )
      },
    },
    {
      input: 'Thin note with no facts.',
      expected: (r: string) => {
        const j = JSON.parse(r)
        return j.gaps?.length > 0 || j.candidates?.length > 0
      },
    },
  ],
}