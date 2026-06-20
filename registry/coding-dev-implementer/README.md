# Dev Implementer

Proposes a **typed, minimal patch plan** that makes the QA specs pass — proposes, never writes your working tree.

```bash
npx agentskit add coding-dev-implementer
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createDevImplementerAgent } from './agents/coding-dev-implementer/agent'

const r = await createDevImplementerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  currentDiff: await git.diff(),         // grounds the plan against working-tree state
  openPr: (plan) => gh.openPr(plan),     // optional, gated
  approve: (plan) => ui.confirm(plan.prTitle),
}).run(`${prdJson}\n\n${qaSpecs}`)
// → { plan: { files: [{ path, action, contents, reason }], prTitle, notes }, pr?, requiresApproval }
```

> The previous version told the model to call `git.diff` / `github.createPR` but wired no tools.

- **Proposes, never writes** — the plan is data you apply; the agent mutates nothing. Each file change is a **full new file** with a spec-tied reason (`invokeStructured` + zod).
- **House rules** — named exports, Zod at every boundary, no `any`, minimal diff (no unrelated refactors).
- **Fail-closed PR** — pass `openPr` to turn the approved plan into a real PR (reports the real url); no `approve` + `autoApprove` off ⇒ nothing opened. Untrusted specs/diff are **fenced**.

`run(specsAndPrd)` → `DevImplementerResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`coding-qa-author`](../coding-qa-author).
