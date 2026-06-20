# KB Searcher

Matches a support ticket to the top knowledge-base articles as **typed hits with a 1–5 confidence**, grounded in **your** corpus — never invents an article.

```bash
npx agentskit add support-kb-searcher
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createKbSearcherAgent } from './agents/support-kb-searcher/agent'

const r = await createKbSearcherAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  retrieve: (ticket) => myVectorStore.search(ticket), // → KbCandidate[]
}).run(ticketText)
// → { hits: [{ title, url, quote, confidence }], noMatch, suggestedTopic? }
```

- **Typed hits** — `invokeStructured` + zod; each hit carries a one-sentence quote and `confidence` 1–5. Sorted by confidence, capped at `topK` (default 3).
- **Grounded** — pass `retrieve` and **only** its candidates may be cited (any other URL is dropped post-hoc); without it the model may only cite articles named in the ticket.
- **Never invents** — when nothing clears `minConfidence`, returns `noMatch: true` + a `suggestedTopic` the missing article should cover, never a hallucinated link.
- Untrusted ticket + candidate text is **fenced**.

`run(ticket)` → `KbSearchResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Pairs with [`support-triage-bot`](../support-triage-bot).
