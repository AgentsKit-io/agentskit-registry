# Partner Deal Desk

> **Status: alpha** — installable via `npx agentskit add sales-partner-deal-desk` for experimentation. Not yet `validated`.

## Pain

Partner deals complex

## Output

Review typed

## Usage

```ts
import { createSalesPartnerDealDeskAgent } from './agents/sales-partner-deal-desk/agent'
const result = await createSalesPartnerDealDeskAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
