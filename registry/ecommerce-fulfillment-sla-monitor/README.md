# Fulfillment SLA Monitor

> **Status: alpha** — installable via `npx agentskit add ecommerce-fulfillment-sla-monitor` for experimentation. Not yet `validated`.

## Pain

SLA breaches

## Output

Alerts typed

## Usage

```ts
import { createEcommerceFulfillmentSlaMonitorAgent } from './agents/ecommerce-fulfillment-sla-monitor/agent'
const result = await createEcommerceFulfillmentSlaMonitorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
