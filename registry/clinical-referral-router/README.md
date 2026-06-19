# Referral Router

Routes a referral packet to the receiving specialty + urgency — typed output, and **never assigns an incomplete packet**.

```bash
npx agentskit add clinical-referral-router
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createReferralRouterAgent } from './agents/clinical-referral-router/agent'

const agent = createReferralRouterAgent({ adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }) })
const r = await agent.run(referralPacketText)
if (r.requiresHumanReview) routeToCoordinator(r)
```

## Why it's safe

1. **Typed routing** — `{ specialty, urgency, rationale, missingFields }` via `invokeStructured` + zod, not free text.
2. **No half-complete assignment** — if critical fields are missing (reason / meds / prior workup) or routing is `unclear`, the case is flagged `requiresHumanReview` and **not** auto-assigned.
3. **Fail-safe** — a failed/malformed run → `unclear` → human coordinator. Untrusted packet text is **fenced**; no clinical determinations beyond routing.

`run(packet)` → `ReferralResult { specialty, urgency, rationale, missingFields[], requiresHumanReview }`. `asHandle()` is JSON-out.

See [composing agents](../../COMPOSING.md). Sibling: [`clinical-intake-triage`](../clinical-intake-triage).
