# Triage Bot

Classifies an inbound support ticket by **topic / severity (P1–P4) / queue** as typed output — with a deterministic **red-flag net** that forces P1.

```bash
npx agentskit add support-triage-bot
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createTriageBotAgent } from './agents/support-triage-bot/agent'

const r = await createTriageBotAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(ticketText)
// → { topic, severity: 'P1'|'P2'|'P3'|'P4', queue, rationale, redFlagsHit[] }
```

- **Typed classification** — `invokeStructured` + zod, severity is an enum (not free text).
- **Red-flag net** — outage / data-loss / security / breach language forces `P1` + the `incident` queue regardless of the model. The model can only *raise* severity, never bury a P1. Override the patterns with `p1RedFlags`.
- **Fail-safe** — if the model can't classify, defaults to `P3` rather than dropping the ticket.
- **Metadata, not a reply** — output feeds the human agent; the bot never replies to the customer. Untrusted ticket text is **fenced**.

`run(ticket)` → `TriageResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md). Pairs with [`support-escalation-drafter`](../support-escalation-drafter) and [`support-kb-searcher`](../support-kb-searcher).
