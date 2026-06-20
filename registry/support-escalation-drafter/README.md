# Escalation Drafter

Turns a ticket + the support agent's notes into a **typed internal escalation draft** — with a deterministic **PII backstop** so customer PII never rides into the internal channel.

```bash
npx agentskit add support-escalation-drafter
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createEscalationDrafterAgent } from './agents/support-escalation-drafter/agent'

const r = await createEscalationDrafterAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(ticketAndNotes)
// → { draft: { customerImpact, whatWeTried, whatWeNeed, need, suggestedSla }, piiStripped, requiresAgentReview }
```

- **Typed draft** — `invokeStructured` + zod; `need` is an enum (`engineering-investigation` | `account-manager-call` | `refund-approval` | `other`).
- **PII backstop** — `createPIIRedactor` re-scans every drafted field and strips raw email / phone / structured ids the model leaked; `piiStripped` reports the count. Layer your own rules with `extraRules`.
- **Always a draft** — `requiresAgentReview` is always true; the agent reviews before posting. Untrusted ticket + notes are **fenced**.

`run(ticketAndNotes)` → `EscalationResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Fed by [`support-triage-bot`](../support-triage-bot).
