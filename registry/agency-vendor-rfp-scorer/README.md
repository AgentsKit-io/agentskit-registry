# Vendor RFP Scorer

> **Status: alpha** — installable via `npx agentskit add agency-vendor-rfp-scorer` for experimentation. Not yet `validated`.

## Pain

RFP scoring subjective

## Output

Scorecard typed

## Usage

```ts
import { createAgencyVendorRfpScorerAgent } from './agents/agency-vendor-rfp-scorer/agent'
const result = await createAgencyVendorRfpScorerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
