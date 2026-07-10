# Fraud Scorer

> **Status: alpha** — installable via `npx agentskit add insurance-fraud-scorer` for experimentation. Not yet `validated`.

## Pain

Claim fraud

## Output

Score typed

## Usage

```ts
import { createInsuranceFraudScorerAgent } from './agents/insurance-fraud-scorer/agent'
const result = await createInsuranceFraudScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
