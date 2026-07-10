# Mutual Action Plan

> **Status: alpha** — installable via `npx agentskit add sales-mutual-action-plan` for experimentation. Not yet `validated`.

## Pain

MAPs manual

## Output

Plan typed

## Usage

```ts
import { createSalesMutualActionPlanAgent } from './agents/sales-mutual-action-plan/agent'
const result = await createSalesMutualActionPlanAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
