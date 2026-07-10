# Payment Dispute Investigator

> **Status: alpha** — installable via `npx agentskit add fintech-payment-dispute-investigator` for experimentation. Not yet `validated`.

## Pain

Chargebacks slow

## Output

Case typed

## Usage

```ts
import { createFintechPaymentDisputeInvestigatorAgent } from './agents/fintech-payment-dispute-investigator/agent'
const result = await createFintechPaymentDisputeInvestigatorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
