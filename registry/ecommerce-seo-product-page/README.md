# Product SEO

> **Status: alpha** — installable via `npx agentskit add ecommerce-seo-product-page` for experimentation. Not yet `validated`.

## Pain

Product SEO weak

## Output

SEO spec typed

## Usage

```ts
import { createEcommerceSeoProductPageAgent } from './agents/ecommerce-seo-product-page/agent'
const result = await createEcommerceSeoProductPageAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
