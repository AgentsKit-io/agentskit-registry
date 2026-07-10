# Asset Inventory Reconciler

> **Status: alpha** — installable via `npx agentskit add ops-asset-inventory-reconciler` for experimentation. Not yet `validated`.

## Pain

Asset drift

## Output

Drift typed

## Usage

```ts
import { createOpsAssetInventoryReconcilerAgent } from './agents/ops-asset-inventory-reconciler/agent'
const result = await createOpsAssetInventoryReconcilerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
