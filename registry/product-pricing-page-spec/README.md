# Pricing Page Spec

> **Status: alpha** — installable via `npx agentskit add product-pricing-page-spec` for experimentation. Not yet `validated`.

## Pain

Pricing pages vague

## Output

Spec typed

## Usage

```ts
import { createProductPricingPageSpecAgent } from './agents/product-pricing-page-spec/agent'
const result = await createProductPricingPageSpecAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
