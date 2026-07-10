# Territory Planner

> **Status: alpha** — installable via `npx agentskit add sales-territory-planner` for experimentation. Not yet `validated`.

## Pain

Territory planning

## Output

Plan typed

## Usage

```ts
import { createSalesTerritoryPlannerAgent } from './agents/sales-territory-planner/agent'
const result = await createSalesTerritoryPlannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
