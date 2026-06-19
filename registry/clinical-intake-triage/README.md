# Intake Triage

Classifies an inbound patient message by urgency and routes it — typed output, with a **deterministic red-flag safety net** so an emergency can't be silently downgraded.

```bash
npx agentskit add clinical-intake-triage
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createIntakeTriageAgent } from './agents/clinical-intake-triage/agent'

const agent = createIntakeTriageAgent({ adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }) })
const r = await agent.run('I have crushing chest pain')
// → { urgency: 'emergency', queue: 'EMERGENCY-911', requiresHumanTriage: true, redFlagsHit: ['chest pain'] }
```

## Why it's safe

1. **Typed classification** — `{ urgency, rationale, queue }` via `invokeStructured` + a zod enum, not free text.
2. **Deterministic red-flag net** — chest pain, stroke signs, suicidal ideation, severe bleeding, trouble breathing force `emergency` regardless of the model. The model can only escalate urgency, never downgrade a red-flag message. Override `redFlags` for your locale/profile.
3. **Fail-safe** — a failed/malformed classification → `unclear` → human triage, never dropped.
4. `unclear` / `emergency` → `requiresHumanTriage`. Untrusted message text is **fenced**; no clinical advice.

`run(message)` → typed `TriageResult { urgency, rationale, queue, redFlagsHit[], requiresHumanTriage }`. `asHandle()` is JSON-out.

## Config

| Option | Purpose |
|--------|---------|
| `redFlags` | emergency patterns that force `emergency` (defaults provided) |
| `observers`, `memory`, `onConfirm`, `maxSteps` | standard runtime options |

See [composing agents](../../COMPOSING.md).
