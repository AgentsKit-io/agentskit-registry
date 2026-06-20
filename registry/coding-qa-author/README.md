# QA Author

Turns a PRD's acceptance criteria into **typed Vitest spec stubs** — one+ block per criterion, with coverage tracking.

```bash
npx agentskit add coding-qa-author
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createQaAuthorAgent } from './agents/coding-qa-author/agent'

const r = await createQaAuthorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  criteriaCount: 5, // optional — enables uncovered-criteria tracking
}).run(prdJson)
// → { specs: [{ path, body, criteria[] }], uncovered[], requiresReview }
```

- **Typed specs** — `invokeStructured` + zod; each spec records which criterion number(s) it covers, so the file can be written verbatim.
- **Coverage tracking** — supply `criteriaCount` and any criterion with no spec is surfaced in `uncovered`, never silently dropped.
- Untrusted PRD text is **fenced**.

`run(prd)` → `QaResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`coding-prd-author`](../coding-prd-author); feeds [`coding-dev-implementer`](../coding-dev-implementer).
