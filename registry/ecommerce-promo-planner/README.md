# Promo Planner

> **Status: alpha** — installable via `npx agentskit add ecommerce-promo-planner` for experimentation. Not yet `validated`.

## Pain

Promos ad-hoc

## Output

Plan typed

## Usage

```ts
import { createEcommercePromoPlannerAgent } from './agents/ecommerce-promo-planner/agent'
const result = await createEcommercePromoPlannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
