# Brand Compliance

> **Status: alpha** — installable via `npx agentskit add marketing-brand-compliance` for experimentation. Not yet `validated`.

## Pain

Off-brand copy ships

## Output

Violations vs guide typed

## Usage

```ts
import { createMarketingBrandComplianceAgent } from './agents/marketing-brand-compliance/agent'
const result = await createMarketingBrandComplianceAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
