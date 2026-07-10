# Migration Planner

> **Status: alpha** — installable via `npx agentskit add coding-migration-planner` for experimentation. Not yet `validated`.

## Pain

Risky schema/API migrations

## Output

Steps + rollback + blast radius typed

## Usage

```ts
import { createCodingMigrationPlannerAgent } from './agents/coding-migration-planner/agent'
const result = await createCodingMigrationPlannerAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
