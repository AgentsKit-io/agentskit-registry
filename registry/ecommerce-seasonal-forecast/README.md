# Seasonal Forecast

> **Status: alpha** — installable via `npx agentskit add ecommerce-seasonal-forecast` for experimentation. Not yet `validated`.

## Pain

Seasonal demand

## Output

Forecast typed

## Usage

```ts
import { createEcommerceSeasonalForecastAgent } from './agents/ecommerce-seasonal-forecast/agent'
const result = await createEcommerceSeasonalForecastAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
