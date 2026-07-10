# Tenant Screening Memo

> **Status: alpha** — installable via `npx agentskit add realestate-tenant-screening-memo` for experimentation. Not yet `validated`.

## Pain

Screening slow

## Output

Memo typed

## Usage

```ts
import { createRealestateTenantScreeningMemoAgent } from './agents/realestate-tenant-screening-memo/agent'
const result = await createRealestateTenantScreeningMemoAgent({ adapter }).run(input)
```

## Gates

- hitl

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
