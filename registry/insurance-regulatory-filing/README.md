# Regulatory Filing

> **Status: alpha** — installable via `npx agentskit add insurance-regulatory-filing` for experimentation. Not yet `validated`.

## Pain

Filings slow

## Output

Filing typed

## Usage

```ts
import { createInsuranceRegulatoryFilingAgent } from './agents/insurance-regulatory-filing/agent'
const result = await createInsuranceRegulatoryFilingAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
