# Competitor Price Monitor

> **Status: alpha** — installable via `npx agentskit add ecommerce-competitor-price-monitor` for experimentation. Not yet `validated`.

## Pain

Price intel

## Output

Report typed

## Usage

```ts
import { createEcommerceCompetitorPriceMonitorAgent } from './agents/ecommerce-competitor-price-monitor/agent'
const result = await createEcommerceCompetitorPriceMonitorAgent({ adapter }).run(input)
```

## Gates

- cite-sources

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
