# Snowflake Cost Optimizer

> **Status: alpha** — installable via `npx agentskit add data-snowflake-cost-optimizer` for experimentation. Not yet `validated`.

## Pain

Warehouse cost

## Output

Recommendations typed

## Usage

```ts
import { createDataSnowflakeCostOptimizerAgent } from './agents/data-snowflake-cost-optimizer/agent'
const result = await createDataSnowflakeCostOptimizerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
