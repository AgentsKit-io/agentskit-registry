# Data Retention Planner

> **Status: alpha** — installable via `npx agentskit add compliance-data-retention-planner` for experimentation. Not yet `validated`.

## Pain

Retention policies

## Output

Plan typed

## Usage

```ts
import { createComplianceDataRetentionPlannerAgent } from './agents/compliance-data-retention-planner/agent'
const result = await createComplianceDataRetentionPlannerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
