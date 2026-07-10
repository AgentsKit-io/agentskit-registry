# SOW from Deal

> **Status: alpha** — installable via `npx agentskit add sales-sow-from-deal` for experimentation. Not yet `validated`.

## Pain

SOW from CRM slow

## Output

SOW typed

## Usage

```ts
import { createSalesSowFromDealAgent } from './agents/sales-sow-from-deal/agent'
const result = await createSalesSowFromDealAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
