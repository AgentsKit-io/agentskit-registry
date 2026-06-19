# Patient Summary

Drafts a **typed one-page pre-visit summary** from chart excerpts — structured fields, never invents values, always a draft for the clinician to confirm.

```bash
npx agentskit add clinical-patient-summary
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createPatientSummaryAgent } from './agents/clinical-patient-summary/agent'

const { summary } = await createPatientSummaryAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(chartExcerpts)
```

- **Typed output** — `{ reasonForVisit, activeProblems[], medications[], allergies[], vitalsTrend, followUps[], openQuestions[] }` via `invokeStructured` + zod (active problems capped at 5).
- **Never invents** — gaps become `"not in chart"` / empty arrays, never guessed.
- **Always a draft** — `requiresClinicianSignoff` is always true. Untrusted chart text is **fenced**.

`run(chart)` → `PatientSummaryResult { summary, requiresClinicianSignoff }`. `asHandle()` is JSON-out.

See [composing agents](../../COMPOSING.md). Sibling: [`clinical-note-summariser`](../clinical-note-summariser).
