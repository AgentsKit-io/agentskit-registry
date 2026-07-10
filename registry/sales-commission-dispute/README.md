# Commission Dispute

> **Status: alpha** — installable via `npx agentskit add sales-commission-dispute` for experimentation. Not yet `validated`.

## Pain

Commission conflicts

## Output

Resolution typed

## Usage

```ts
import { createSalesCommissionDisputeAgent } from './agents/sales-commission-dispute/agent'
const result = await createSalesCommissionDisputeAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
