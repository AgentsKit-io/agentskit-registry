# Shipping Exception

> **Status: alpha** — installable via `npx agentskit add ecommerce-shipping-exception` for experimentation. Not yet `validated`.

## Pain

Shipping issues

## Output

Resolution typed

## Usage

```ts
import { createEcommerceShippingExceptionAgent } from './agents/ecommerce-shipping-exception/agent'
const result = await createEcommerceShippingExceptionAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
