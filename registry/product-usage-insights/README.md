# Usage Insights

> **Status: alpha** — installable via `npx agentskit add product-usage-insights` for experimentation. Not yet `validated`.

## Pain

Usage data unread

## Output

Insights typed

## Usage

```ts
import { createProductUsageInsightsAgent } from './agents/product-usage-insights/agent'
const result = await createProductUsageInsightsAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
