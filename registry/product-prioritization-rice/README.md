# RICE Prioritizer

> **Status: alpha** — installable via `npx agentskit add product-prioritization-rice` for experimentation. Not yet `validated`.

## Pain

Prioritization subjective

## Output

Scores typed

## Usage

```ts
import { createProductPrioritizationRiceAgent } from './agents/product-prioritization-rice/agent'
const result = await createProductPrioritizationRiceAgent({ adapter }).run(input)
```

## Gates

- typed-output
- never-invent
- always-draft

## Promote to validated

Human review + expand `eval.ts` + set `status: validated` in meta.json.
