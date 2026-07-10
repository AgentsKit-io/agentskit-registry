# Catalog Enricher

> **Status: alpha** — installable via `npx agentskit add ecommerce-catalog-enricher` for experimentation. Not yet `validated`.

## Pain

Thin catalog data

## Output

Enrichment typed

## Usage

```ts
import { createEcommerceCatalogEnricherAgent } from './agents/ecommerce-catalog-enricher/agent'
const result = await createEcommerceCatalogEnricherAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
