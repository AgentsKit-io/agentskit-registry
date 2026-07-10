# Metrics Tree Author

> **Status: alpha** — installable via `npx agentskit add product-metrics-tree-author` for experimentation. Not yet `validated`.

## Pain

Metrics trees ad-hoc

## Output

Tree typed

## Usage

```ts
import { createProductMetricsTreeAuthorAgent } from './agents/product-metrics-tree-author/agent'
const result = await createProductMetricsTreeAuthorAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
