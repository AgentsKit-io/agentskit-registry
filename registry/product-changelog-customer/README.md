# Customer Changelog

> **Status: alpha** — installable via `npx agentskit add product-changelog-customer` for experimentation. Not yet `validated`.

## Pain

Customer-facing changelog

## Output

Changelog typed

## Usage

```ts
import { createProductChangelogCustomerAgent } from './agents/product-changelog-customer/agent'
const result = await createProductChangelogCustomerAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
