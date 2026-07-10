# Supplier Communicator

> **Status: alpha** — installable via `npx agentskit add ecommerce-supplier-communicator` for experimentation. Not yet `validated`.

## Pain

Supplier emails

## Output

Email draft typed

## Usage

```ts
import { createEcommerceSupplierCommunicatorAgent } from './agents/ecommerce-supplier-communicator/agent'
const result = await createEcommerceSupplierCommunicatorAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
