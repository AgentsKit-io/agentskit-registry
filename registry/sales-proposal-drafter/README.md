# Proposal Drafter

> **Status: alpha** — installable via `npx agentskit add sales-proposal-drafter` for experimentation. Not yet `validated`.

## Pain

Proposals slow

## Output

Proposal typed

## Usage

```ts
import { createSalesProposalDrafterAgent } from './agents/sales-proposal-drafter/agent'
const result = await createSalesProposalDrafterAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
