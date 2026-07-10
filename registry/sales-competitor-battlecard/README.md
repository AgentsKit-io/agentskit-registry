# Competitor Battlecard

> **Status: alpha** — installable via `npx agentskit add sales-competitor-battlecard` for experimentation. Not yet `validated`.

## Pain

Battlecards stale

## Output

Card typed

## Usage

```ts
import { createSalesCompetitorBattlecardAgent } from './agents/sales-competitor-battlecard/agent'
const result = await createSalesCompetitorBattlecardAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
