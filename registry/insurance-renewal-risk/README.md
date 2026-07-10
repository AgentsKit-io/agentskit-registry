# Renewal Risk

> **Status: alpha** — installable via `npx agentskit add insurance-renewal-risk` for experimentation. Not yet `validated`.

## Pain

Renewal risk

## Output

Risk typed

## Usage

```ts
import { createInsuranceRenewalRiskAgent } from './agents/insurance-renewal-risk/agent'
const result = await createInsuranceRenewalRiskAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
