# Market Sizing

> **Status: alpha** — installable via `npx agentskit add research-market-sizing` for experimentation. Not yet `validated`.

## Pain

TAM/SAM/SOM guesses

## Output

Sizing typed + explicit assumptions

## Usage

```ts
import { createResearchMarketSizingAgent } from './agents/research-market-sizing/agent'
const result = await createResearchMarketSizingAgent({ adapter }).run(input)
```

## Gates

- gaps-not-guesses

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
