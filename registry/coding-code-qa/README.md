# Code QA

Runs the project's test / lint / type-check commands through **your** runner, then turns the real output into a **typed failure report**.

```bash
npx agentskit add coding-code-qa
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCodeQaAgent } from './agents/coding-code-qa/agent'

const report = await createCodeQaAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  run: (cmd) => myRunner(cmd),   // → { stdout, stderr, code, durationMs }
  commands: ['pnpm test', 'pnpm lint', 'pnpm typecheck'],
}).run('feature/login')
// → { allGreen, commands: [{ command, code }], failures: [{ reproducer, command, message, rootCause }], summary }
```

> The previous version told the model to "run them" but wired no tools. Now execution is real and **stays in your sandbox**.

- **Execution stays yours** — the agent never spawns a shell; you inject `run`, so your sandbox/policy governs what executes. With every command green it short-circuits to `allGreen` without calling the model.
- **Typed failures** — only the failing commands' output is handed to the model (`invokeStructured` + zod) for a grouped report with per-failure root cause. Reports only what ran — never invents.
- **Reports, never fixes.** Untrusted command output is **fenced**.

`run(branch)` → `CodeQaReport`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Sibling of [`coding-test-runner`](../coding-test-runner) (which parses output you already captured).
