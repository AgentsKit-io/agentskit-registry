# Listing Optimizer

> **Status: alpha** — installable via `npx agentskit add ecommerce-listing-optimizer` for experimentation. Not yet `validated`.

## Pain

Weak listings

## Output

Optimized listing typed

## Usage

```ts
import { createEcommerceListingOptimizerAgent } from './agents/ecommerce-listing-optimizer/agent'
const result = await createEcommerceListingOptimizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
