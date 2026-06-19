# Case Analyst

Extracts a **typed, cited analysis** from a case file — every datum cites its source, gaps are "not in record", deadline risks surfaced at the top.

```bash
npx agentskit add legal-case-analyst
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCaseAnalystAgent } from './agents/legal-case-analyst/agent'

const r = await createCaseAnalystAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(caseFile)
// → { analysis: { parties[], jurisdictionVenue, proceduralPosture, claims[], defenses[], keyDates[], openDiscovery[] }, deadlineRisks[], requiresAttorneyReview }
```

- **Typed + cited** — `invokeStructured` + zod; every field is a `{ value, citation }` pair (source document + page).
- **Never infers** — a field the record is silent on is `"not in record"` for both value and citation, never guessed.
- **Deadline-first** — statute-of-limitations / filing-deadline risks are pulled into `deadlineRisks` for the attorney. Always a draft; untrusted file text is **fenced**.

`run(caseFile)` → `CaseAnalysisResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Feeds [`legal-doc-drafter`](../legal-doc-drafter) and [`legal-case-summariser`](../legal-case-summariser).
