# Chart Redactor

Redacts HIPAA identifiers from a clinical chart before cross-tenant export — with a **deterministic backstop** so no structured identifier can slip through, even if the model misses it.

```bash
npx agentskit add clinical-chart-redactor
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createChartRedactorAgent } from './agents/clinical-chart-redactor/agent'

const agent = createChartRedactorAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  extraRules: [{ name: 'mrn', pattern: /\bMRN[-:\s]?\d{6,}\b/gi, replacer: '[REDACTED_MRN]' }],
})

const { redacted, log, status } = await agent.run(chartText)
```

## Why it's safe

A prompt-only redactor trusts the model to have caught everything. This one doesn't:

1. **Model redaction** — does the bulk (names, free-text, dates) → typed `{ redacted, log }`.
2. **Deterministic backstop** — `createPIIRedactor` (`@agentskit/core/security`) re-scans the model's output and strips any structured identifier left behind (email, phone, SSN, IP, credit-card, UUID + your `extraRules` for MRN/DOB/known names). The emitted chart is **always clean of those patterns**, regardless of the model.
3. **Flagged** — anything the backstop catches is logged with `backstop: true` (the model under-redacted), so misses are visible, never silent.
4. Clinical findings/medications are preserved; untrusted chart text is **fenced**.

## Config

| Option | Purpose |
|--------|---------|
| `extraRules` | institution-specific deterministic patterns (MRN, known patient names, ids) |
| `observers`, `memory`, `onConfirm`, `maxSteps` | standard runtime options |

`run(chart)` → `{ redacted, log[], status: 'clean'|'backstop-applied' }`. `asHandle()` returns the redacted chart text.

> Names/free-text PHI rely on the model + your `extraRules`. The deterministic backstop guarantees the *structured* identifier classes; supply name/MRN patterns via `extraRules` for full coverage.

See [composing agents](../../COMPOSING.md).
