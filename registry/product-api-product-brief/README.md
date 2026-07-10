# API Product Brief

> **Status: alpha** — installable via `npx agentskit add product-api-product-brief` for experimentation. Not yet `validated`.

## Pain

API product specs

## Output

Brief typed

## Usage

```ts
import { createProductApiProductBriefAgent } from './agents/product-api-product-brief/agent'
const result = await createProductApiProductBriefAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
