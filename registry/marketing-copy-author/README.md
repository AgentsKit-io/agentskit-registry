# Copy Author

Produces exactly **three distinct typed copy variants** — `bold` / `warm` / `precise` — from a structured brief.

```bash
npx agentskit add marketing-copy-author
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createCopyAuthorAgent } from './agents/marketing-copy-author/agent'

const r = await createCopyAuthorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  maxWords: 150,
}).run(structuredBrief)
// → { variants: [{ variantId, headline, subheadline, body, cta, channel, targetPersona, toneRationale }], overLength[], requiresReview }
```

- **Exactly three typed variants** — `invokeStructured` + zod enforces `bold` (challenger / LinkedIn), `warm` (story-led / email), `precise` (evidence-first / product page).
- **No invented numbers** — every metric must come from the brief or competitive report.
- **Length-checked** — bodies over `maxWords` (default 150) are flagged in `overLength`, never silently truncated. Untrusted brief text is **fenced**.

`run(brief)` → `CopyResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`marketing-brief-analyst`](../marketing-brief-analyst); pairs with [`marketing-social-publisher`](../marketing-social-publisher).
