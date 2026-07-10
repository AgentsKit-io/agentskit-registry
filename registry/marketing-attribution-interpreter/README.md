# Attribution Interpreter

> **Status: alpha** — installable via `npx agentskit add marketing-attribution-interpreter` for experimentation. Not yet `validated`.

## Pain

Attribution reports confusing

## Output

Insights typed

## Usage

```ts
import { createMarketingAttributionInterpreterAgent } from './agents/marketing-attribution-interpreter/agent'
const result = await createMarketingAttributionInterpreterAgent({ adapter }).run(input)
```

## Gates

- cite-data

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
