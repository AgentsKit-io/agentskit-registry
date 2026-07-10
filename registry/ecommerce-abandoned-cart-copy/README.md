# Abandoned Cart Copy

> **Status: alpha** — installable via `npx agentskit add ecommerce-abandoned-cart-copy` for experimentation. Not yet `validated`.

## Pain

Cart recovery weak

## Output

Copy typed

## Usage

```ts
import { createEcommerceAbandonedCartCopyAgent } from './agents/ecommerce-abandoned-cart-copy/agent'
const result = await createEcommerceAbandonedCartCopyAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
