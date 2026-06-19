# Schedule Planner

Drafts a **typed multi-channel publish schedule** from approved drafts + channel constraints — flags conflicts instead of dropping items, never schedules itself.

```bash
npx agentskit add agency-schedule-planner
```

```ts
import { anthropic } from '@agentskit/adapters'
import { createSchedulePlannerAgent } from './agents/agency-schedule-planner/agent'

const r = await createSchedulePlannerAgent({
  adapter: anthropic({ apiKey: process.env.ANTHROPIC_API_KEY!, model: 'claude-opus-4-8' }),
}).run(`DRAFTS:\n${drafts}\n\nCONSTRAINTS:\n${windows}`)
// → { schedule: [{ date, channel, assetId, rationale }], conflicts: [{ type, assetIds[], detail }], requiresApproval }
```

- **Typed schedule** — `invokeStructured` + zod; each slot carries a cadence rationale.
- **Flags, never drops** — window collisions, embargo breaches, and frequency-cap violations land in `conflicts` (with the asset ids), not silently discarded.
- **Never auto-publishes** — `requiresApproval` always true; the plan is for the account lead to confirm before any post goes out. Untrusted input is **fenced**.

`run(draftsAndConstraints)` → `ScheduleResult`. `asHandle()` is JSON-out. See [composing agents](../../COMPOSING.md).
