# Warehouse Migration Planner

> **Status: alpha** — installable via `npx agentskit add data-warehouse-migration` for experimentation. Not yet `validated`.

## Pain

DW migrations risky

## Output

Plan typed

## Usage

```ts
import { createDataWarehouseMigrationAgent } from './agents/data-warehouse-migration/agent'
const result = await createDataWarehouseMigrationAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
