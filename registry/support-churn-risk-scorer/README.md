# Churn Risk Scorer

> **Status: alpha** — installable via `npx agentskit add support-churn-risk-scorer` for experimentation. Not yet `validated`.

## Pain

Silent churn

## Output

Risk score typed

## Usage

```ts
import { createSupportChurnRiskScorerAgent } from './agents/support-churn-risk-scorer/agent'
const result = await createSupportChurnRiskScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
