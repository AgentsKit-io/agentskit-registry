# SLA Breach Alerter

> **Status: alpha** — installable via `npx agentskit add support-sla-breach-alerter` for experimentation. Not yet `validated`.

## Pain

SLA misses late

## Output

Alert typed

## Usage

```ts
import { createSupportSlaBreachAlerterAgent } from './agents/support-sla-breach-alerter/agent'
const result = await createSupportSlaBreachAlerterAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
