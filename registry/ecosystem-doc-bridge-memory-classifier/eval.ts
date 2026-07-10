import type { EvalSuite } from '@agentskit/eval'

export const suite: EvalSuite = {
  name: 'ecosystem-doc-bridge-memory-classifier',
  cases: [
    {
      input: 'Note: package auth owns session refresh. Always forward AbortSignal in handlers.',
      expected: (r: string) => /promote|hold/i.test(r) && /candidate/i.test(r),
    },
    {
      input: 'Scratch: ignore this todo about lunch.',
      expected: (r: string) => /reject|hold/i.test(r),
    },
    {
      input: 'api_key=sk-test-12345 stored in .env.local',
      expected: (r: string) => /reject/i.test(r) && /secret/i.test(r),
    },
    {
      input: 'Thin note with no facts.',
      expected: (r: string) => /gap/i.test(r) || /candidate/i.test(r),
    },
  ],
}