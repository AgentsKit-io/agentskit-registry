# Account Plan Author

> **Status: alpha** — installable via `npx agentskit add sales-account-plan-author` for experimentation. Not yet `validated`.

## Pain

Account plans manual

## Output

Plan typed

## Usage

```ts
import { createSalesAccountPlanAuthorAgent } from './agents/sales-account-plan-author/agent'
const result = await createSalesAccountPlanAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
