# Review Responder

> **Status: alpha** — installable via `npx agentskit add ecommerce-review-responder` for experimentation. Not yet `validated`.

## Pain

Review replies slow

## Output

Reply draft typed

## Usage

```ts
import { createEcommerceReviewResponderAgent } from './agents/ecommerce-review-responder/agent'
const result = await createEcommerceReviewResponderAgent({ adapter }).run(input)
```

## Gates

- draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
