# RFP Responder

> **Status: alpha** — installable via `npx agentskit add sales-rfp-responder` for experimentation. Not yet `validated`.

## Pain

RFP responses slow

## Output

Response typed

## Usage

```ts
import { createSalesRfpResponderAgent } from './agents/sales-rfp-responder/agent'
const result = await createSalesRfpResponderAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
