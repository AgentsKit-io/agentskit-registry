# Redaction Bot

Redacts PII from a legal document before it leaves the matter — with a **deterministic backstop** (no structured identifier slips through) and **privilege flagging** (privileged content is surfaced for the attorney, never silently redacted).

```bash
npx agentskit add legal-redaction-bot
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createRedactionBotAgent } from './agents/legal-redaction-bot/agent'

const agent = createRedactionBotAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
  extraRules: [{ name: 'acct', pattern: /\b\d{8,17}\b/g, replacer: '[REDACTED_ACCT]' }],
})

const { redacted, log, privilegeFlags, status } = await agent.run(documentText)
```

## Why it's safe

1. **Model redaction** → typed `{ redacted, log, privilegeFlags }`.
2. **Deterministic backstop** — `createPIIRedactor` re-scans the model's output and strips any structured identifier it missed (SSN/email/phone/IP/CC/UUID + your `extraRules` for gov-IDs / account numbers). The emitted document is **always clean** of those patterns.
3. **Privilege flags, not silent redaction** — privileged spans are returned in `privilegeFlags` for the supervising attorney to decide; silently redacting privilege would lose it / mislead review.
4. Misses are flagged (`backstop: true`); untrusted text is **fenced**.

## Config

| Option | Purpose |
|--------|---------|
| `extraRules` | deterministic patterns for gov-IDs / account numbers / matter-specific ids |
| `observers`, `memory`, `onConfirm`, `maxSteps` | standard runtime options |

`run(document)` → `{ redacted, log[], privilegeFlags[], status }`. `asHandle()` returns the redacted text.

See [composing agents](../../COMPOSING.md). Sibling: [`clinical-chart-redactor`](../clinical-chart-redactor) (same backstop, HIPAA profile).
