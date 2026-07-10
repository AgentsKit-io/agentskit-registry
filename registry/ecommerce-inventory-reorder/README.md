# Inventory Reorder

> **Status: alpha** — installable via `npx agentskit add ecommerce-inventory-reorder` for experimentation. Not yet `validated`.

## Pain

Stockouts/overstock

## Output

Reorder typed

## Usage

```ts
import { createEcommerceInventoryReorderAgent } from './agents/ecommerce-inventory-reorder/agent'
const result = await createEcommerceInventoryReorderAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
