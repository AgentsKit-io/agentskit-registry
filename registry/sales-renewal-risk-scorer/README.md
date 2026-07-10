# Renewal Risk Scorer

> **Status: alpha** — installable via `npx agentskit add sales-renewal-risk-scorer` for experimentation. Not yet `validated`.

## Pain

Renewal risk hidden

## Output

Score typed

## Usage

```ts
import { createSalesRenewalRiskScorerAgent } from './agents/sales-renewal-risk-scorer/agent'
const result = await createSalesRenewalRiskScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
