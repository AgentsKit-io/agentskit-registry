# Marketplace Policy Check

> **Status: alpha** — installable via `npx agentskit add ecommerce-marketplace-policy-check` for experimentation. Not yet `validated`.

## Pain

Policy violations

## Output

Violations typed

## Usage

```ts
import { createEcommerceMarketplacePolicyCheckAgent } from './agents/ecommerce-marketplace-policy-check/agent'
const result = await createEcommerceMarketplacePolicyCheckAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
