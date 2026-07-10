# Expansion Opportunity

> **Status: alpha** — installable via `npx agentskit add sales-expansion-opportunity` for experimentation. Not yet `validated`.

## Pain

Upsell missed

## Output

Opportunities typed

## Usage

```ts
import { createSalesExpansionOpportunityAgent } from './agents/sales-expansion-opportunity/agent'
const result = await createSalesExpansionOpportunityAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
