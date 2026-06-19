# Deck Builder

Drafts a **typed pitch/status deck** from project artifacts — every number must cite its source.

```bash
npx agentskit add agency-deck-builder
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createDeckBuilderAgent } from './agents/agency-deck-builder/agent'

const r = await createDeckBuilderAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  // sections: ['cover', 'context', ...]  // optional override
}).run(`${brief}\n${kpis}\n${milestoneNotes}`)
// → { deck: [{ section, bullets[], citations[] }], uncitedMetrics[], requiresReview }
```

- **Typed slides** — `invokeStructured` + zod; configurable `sections` (default cover → next steps).
- **Cited numbers** — every metric must cite its source artifact; a slide that quotes a number with no citation is flagged in `uncitedMetrics`. Missing data becomes `"data to be confirmed"`, never invented.
- **Always a draft** — `requiresReview` always true. Untrusted artifacts are **fenced**.

`run(artifacts)` → `DeckResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`agency-brief-generator`](../agency-brief-generator).
