# SOAP Generator

Turns clinician dictation into a **typed SOAP note** (Subjective / Objective / Assessment / Plan) — each section addressable, missing sections surfaced (never invented), always a draft for sign-off.

```bash
npx agentskit add clinical-note-summariser
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createNoteSummariserAgent } from './agents/clinical-note-summariser/agent'

const { note, missingFields, requiresClinicianSignoff } = await createNoteSummariserAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(dictationText)
```

- **Typed output** — `{ subjective, objective, assessment, plan }` via `invokeStructured` + zod, not one blob; downstream tooling can address each section.
- **Never invents** — uncovered sections go to `missingFields` (left blank) for the clinician to fill.
- **Always a draft** — `requiresClinicianSignoff` is always true. Untrusted dictation is **fenced**; facts preserved verbatim.

`run(dictation)` → `NoteResult { note, missingFields[], requiresClinicianSignoff }`. `asHandle()` is JSON-out.

See [composing agents](../../COMPOSING.md).
