# Warranty Claim Triage

> **Status: alpha** — installable via `npx agentskit add ecommerce-warranty-claim-triage` for experimentation. Not yet `validated`.

## Pain

Warranty intake

## Output

Triage typed

## Usage

```ts
import { createEcommerceWarrantyClaimTriageAgent } from './agents/ecommerce-warranty-claim-triage/agent'
const result = await createEcommerceWarrantyClaimTriageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
