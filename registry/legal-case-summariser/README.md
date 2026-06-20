# Case Summariser

Produces a **typed, court-ready matter summary** from reviewed documents + reviewer notes — every fact cited, conflicts flagged not resolved.

```bash
npx agentskit add legal-case-summariser
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCaseSummariserAgent } from './agents/legal-case-summariser/agent'

const r = await createCaseSummariserAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(`${reviewedDocs}\n\n${reviewerNotes}`)
// → { summary: { partiesAndCounsel, proceduralPosture, keyFacts: [{ fact, citation }], openIssues[] }, conflicts: [{ issue, positions[] }], requiresAttorneyReview }
```

- **Typed + cited** — `invokeStructured` + zod; every key fact cites its underlying document ID.
- **Flags conflicts** — inconsistent notes are recorded in `conflicts` with the competing positions, never silently resolved by picking a side.
- **Neutral & always a draft** — no editorialising; `requiresAttorneyReview` always true. Untrusted input is **fenced**.

`run(docsAndNotes)` → `CaseSummaryResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Pairs with [`legal-case-analyst`](../legal-case-analyst).
