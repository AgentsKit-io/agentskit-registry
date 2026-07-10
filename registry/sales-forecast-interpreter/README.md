# Forecast Interpreter

> **Status: alpha** — installable via `npx agentskit add sales-forecast-interpreter` for experimentation. Not yet `validated`.

## Pain

Forecast opaque

## Output

Insights typed

## Usage

```ts
import { createSalesForecastInterpreterAgent } from './agents/sales-forecast-interpreter/agent'
const result = await createSalesForecastInterpreterAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
