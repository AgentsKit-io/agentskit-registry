# Pricing Calculator Memo

> **Status: alpha** — installable via `npx agentskit add sales-pricing-calculator-memo` for experimentation. Not yet `validated`.

## Pain

Pricing opaque

## Output

Memo typed

## Usage

```ts
import { createSalesPricingCalculatorMemoAgent } from './agents/sales-pricing-calculator-memo/agent'
const result = await createSalesPricingCalculatorMemoAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
