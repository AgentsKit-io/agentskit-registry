# Test Runner

Parses raw Vitest output into a **typed test report** — per-failure root-cause hypotheses, grouped for prioritisation.

```bash
npx agentskit add coding-test-runner
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createTestRunnerAgent } from './agents/coding-test-runner/agent'

const report = await createTestRunnerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(vitestStdout)
// → { passed, failed, skipped, duration, failures: [{ test, file, message, rootCause }], summary }
```

- **Typed report** — `invokeStructured` + zod; each failure gets a one-sentence root-cause hypothesis, grouped by suspected cause.
- **Analyses, doesn't execute** — it parses output **you** captured; no shell access by design (safe to run anywhere). Reports only what the output shows — never invents passes or failures.
- Untrusted output text is **fenced**.

`run(vitestOutput)` → `TestReport`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Sibling of [`coding-code-qa`](../coding-code-qa) (which runs the commands).
