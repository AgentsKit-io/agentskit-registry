# Chargeback Responder

> **Status: alpha** — installable via `npx agentskit add ecommerce-chargeback-responder` for experimentation. Not yet `validated`.

## Pain

Chargebacks

## Output

Response typed

## Usage

```ts
import { createEcommerceChargebackResponderAgent } from './agents/ecommerce-chargeback-responder/agent'
const result = await createEcommerceChargebackResponderAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
