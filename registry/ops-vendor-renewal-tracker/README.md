# Vendor Renewal Tracker

> **Status: alpha** — installable via `npx agentskit add ops-vendor-renewal-tracker` for experimentation. Not yet `validated`.

## Pain

Renewals missed

## Output

Tracker typed

## Usage

```ts
import { createOpsVendorRenewalTrackerAgent } from './agents/ops-vendor-renewal-tracker/agent'
const result = await createOpsVendorRenewalTrackerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
