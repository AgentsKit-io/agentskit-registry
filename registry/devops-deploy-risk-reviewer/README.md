# Deploy Risk Reviewer

> **Status: alpha** — installable via `npx agentskit add devops-deploy-risk-reviewer` for experimentation. Not yet `validated`.

## Pain

Risky deploys

## Output

Risk typed

## Usage

```ts
import { createDevopsDeployRiskReviewerAgent } from './agents/devops-deploy-risk-reviewer/agent'
const result = await createDevopsDeployRiskReviewerAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
