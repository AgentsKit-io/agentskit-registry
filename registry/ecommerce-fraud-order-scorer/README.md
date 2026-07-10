# Fraud Order Scorer

> **Status: alpha** — installable via `npx agentskit add ecommerce-fraud-order-scorer` for experimentation. Not yet `validated`.

## Pain

Order fraud

## Output

Score typed

## Usage

```ts
import { createEcommerceFraudOrderScorerAgent } from './agents/ecommerce-fraud-order-scorer/agent'
const result = await createEcommerceFraudOrderScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
