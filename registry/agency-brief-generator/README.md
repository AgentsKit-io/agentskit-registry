# Brief Generator

Drafts a **typed creative brief** from client kickoff notes — pulls facts only from the notes, never invents.

```bash
npx agentskit add agency-brief-generator
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createBriefGeneratorAgent } from './agents/agency-brief-generator/agent'

const r = await createBriefGeneratorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(kickoffNotes)
// → { brief: { clientAndProduct, audience, keyInsight, singleMindedProposition, mandatories[], tone, deliverables[], timeline }, toBeConfirmed[], requiresReview }
```

- **Typed brief** — `invokeStructured` + zod; every section is an addressable field.
- **Never invents** — a field without input is set to `"to be confirmed with the client"` and surfaced in `toBeConfirmed` so the team knows what to chase.
- **Always a draft** — `requiresReview` always true. Untrusted notes are **fenced**.

`run(notes)` → `BriefResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Feeds [`agency-deck-builder`](../agency-deck-builder).
