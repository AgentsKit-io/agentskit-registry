# Legal Doc Reviewer

One configurable legal-review agent — supersedes the separate `contract-reviewer`, `discovery-reviewer`, and `privilege-spotter` (they were single-pass prompts with no structural difference). Pick a `mode`:

| mode | what it does |
|---|---|
| `contract` | clause-by-clause risk review (risky language, missing standard terms) |
| `discovery` | flags privileged + responsive material |
| `privilege` | privilege-only second-pass (over-inclusive — a missed waiver is irreversible) |

```bash
npx agentskit add legal-doc-reviewer
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createLegalDocReviewerAgent } from './agents/legal-doc-reviewer/agent'

const r = await createLegalDocReviewerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  mode: 'discovery',
}).run(documentText)

if (r.requiresAttorneyReview) routeForReview(r.findings)
```

## Why it's gold standard

- **Typed findings** — each `{ id, severity, category, title, detail, location?, recommendation? }` via `invokeStructured` + zod (shared `Finding` shape), not free text.
- **Attorney gate** — any privileged or critical/high finding sets `requiresAttorneyReview`; the agent never makes a final legal determination.
- **Fail-safe** — a failed review escalates to an attorney, never passes clean. Untrusted document text is **fenced**.

`run(document)` → `LegalReviewResult { mode, findings[], requiresAttorneyReview }`. `asHandle()` is JSON-out.

See [composing agents](../../COMPOSING.md).
