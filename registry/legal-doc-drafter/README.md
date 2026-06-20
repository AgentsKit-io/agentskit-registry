# Doc Drafter

Drafts a legal document (memo / motion / demand-letter / client-update) from an approved fact pattern — **every inference flagged, always a draft**.

```bash
npx agentskit add legal-doc-drafter
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createDocDrafterAgent } from './agents/legal-doc-drafter/agent'

const r = await createDocDrafterAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  docType: 'demand-letter', // memo | motion | demand-letter | client-update
}).run(approvedFactPattern)
// → { docType, document, inferences: [{ text, basis }], openQuestions[], requiresAttorneyReview }
```

- **Typed output** — `invokeStructured` + zod; configurable `docType`.
- **Inferences surfaced** — every inference is flagged inline with `[inference]` **and** pulled into `inferences` (with its basis) for attorney verification — no quiet leaps.
- **Always a draft** — never final, never a signature; ends with `openQuestions` the attorney must resolve before sign-off. Untrusted facts are **fenced**.

`run(facts)` → `DocDraftResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`legal-case-analyst`](../legal-case-analyst).
